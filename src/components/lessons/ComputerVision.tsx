import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Camera,
  CheckCircle,
  Eye,
  Frown,
  Laugh,
  Loader2,
  ScanFace,
  Sparkles,
} from 'lucide-react';

interface ComputerVisionProps {
  onComplete: () => void;
}

type MoodLabel = 'happy' | 'sad';
type FaceApiModule = typeof import('@vladmandic/face-api');

interface DetectionSnapshot {
  expressions: Record<string, number>;
  topLabel: string;
  topConfidence: number;
}

interface PredictionState {
  label: MoodLabel | 'uncertain';
  confidence: number;
  pretrainedLabel: string;
  pretrainedConfidence: number;
}

const MIN_SAMPLES_PER_LABEL = 8;
const DETECTION_INTERVAL_MS = 1000;
const EXPRESSION_ORDER = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];

const ComputerVision: React.FC<ComputerVisionProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sampleCounts, setSampleCounts] = useState<Record<MoodLabel, number>>({ happy: 0, sad: 0 });
  const [cameraError, setCameraError] = useState('');
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [isBuildingTrainingSet, setIsBuildingTrainingSet] = useState(false);
  const [trainingReady, setTrainingReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Load the pretrained face model, then start the camera.');
  const [prediction, setPrediction] = useState<PredictionState | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceApiRef = useRef<FaceApiModule | null>(null);
  const predictionLoopRef = useRef<number | null>(null);
  const userTrainingSamplesRef = useRef<Record<MoodLabel, number[][]>>({ happy: [], sad: [] });
  const trainingCentroidsRef = useRef<Record<MoodLabel, number[] | null>>({ happy: null, sad: null });

  useEffect(() => {
    return () => {
      stopPredictionLoop();
      stopCamera();
    };
  }, []);

  const stopPredictionLoop = () => {
    if (predictionLoopRef.current !== null) {
      window.clearInterval(predictionLoopRef.current);
      predictionLoopRef.current = null;
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const loadModels = async () => {
    if (modelsReady || isLoadingModels) {
      return;
    }

    setIsLoadingModels(true);
    setStatusMessage('Loading pretrained face-api models...');

    try {
      const faceapi = await import('@vladmandic/face-api');
      faceApiRef.current = faceapi;

      try {
        await faceapi.tf.setBackend('webgl');
      } catch {
        await faceapi.tf.setBackend('cpu');
      }

      await faceapi.tf.ready();
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models/face-api'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models/face-api'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models/face-api'),
      ]);

      setModelsReady(true);
      setStatusMessage('Pretrained emotion model is ready. Start the camera to personalize it.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load face-api models.';
      setStatusMessage(`Model loading failed: ${message}`);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      setStatusMessage('Requesting camera access...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 960 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraStarted(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);
      setStatusMessage('Camera ready. Capture happy and sad examples to personalize the model.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not access the camera.';
      setCameraError(message);
      setStatusMessage('Camera access is required for this lesson.');
    }
  };

  const detectExpressions = async (): Promise<DetectionSnapshot | null> => {
    const faceapi = faceApiRef.current;
    const video = videoRef.current;

    if (!faceapi || !video || video.readyState < 2) {
      return null;
    }

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.4,
    });

    const detection = await faceapi
      .detectSingleFace(video, options)
      .withFaceLandmarks(true)
      .withFaceExpressions();

    if (!detection) {
      return null;
    }

    const expressions = detection.expressions as unknown as Record<string, number>;
    const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
    const [topLabel, topConfidence] = sorted[0] ?? ['neutral', 0];

    return {
      expressions,
      topLabel,
      topConfidence,
    };
  };

  const vectorFromExpressions = (expressions: Record<string, number>) =>
    EXPRESSION_ORDER.map((label) => expressions[label] ?? 0);

  const captureSample = async (label: MoodLabel) => {
    const detection = await detectExpressions();

    if (!detection) {
      setStatusMessage('No face was detected. Center your face in the camera and try again.');
      return;
    }

    userTrainingSamplesRef.current[label].push(vectorFromExpressions(detection.expressions));
    setSampleCounts((prev) => ({
      ...prev,
      [label]: userTrainingSamplesRef.current[label].length,
    }));
    setTrainingReady(false);
    setPrediction(null);
    stopPredictionLoop();
    setStatusMessage(
      `Saved a ${label} training example. The pretrained model currently sees "${detection.topLabel}" at ${Math.round(
        detection.topConfidence * 100,
      )}% confidence.`,
    );
  };

  const averageVectors = (vectors: number[][]) =>
    vectors[0].map((_, index) => vectors.reduce((sum, vector) => sum + vector[index], 0) / vectors.length);

  const euclideanDistance = (a: number[], b: number[]) =>
    Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));

  const buildTrainingSet = async () => {
    const happySamples = userTrainingSamplesRef.current.happy;
    const sadSamples = userTrainingSamplesRef.current.sad;

    if (happySamples.length < MIN_SAMPLES_PER_LABEL || sadSamples.length < MIN_SAMPLES_PER_LABEL) {
      setStatusMessage(
        `Capture at least ${MIN_SAMPLES_PER_LABEL} happy examples and ${MIN_SAMPLES_PER_LABEL} sad examples first.`,
      );
      return;
    }

    setIsBuildingTrainingSet(true);
    setPrediction(null);
    stopPredictionLoop();

    try {
      trainingCentroidsRef.current = {
        happy: averageVectors(happySamples),
        sad: averageVectors(sadSamples),
      };

      setTrainingReady(true);
      setStatusMessage('Personalized training set ready. Try a face and watch the live prediction.');
      startPredictionLoop();
    } finally {
      setIsBuildingTrainingSet(false);
    }
  };

  const classifyWithTrainingSet = (expressions: Record<string, number>): PredictionState => {
    const vector = vectorFromExpressions(expressions);
    const happyCenter = trainingCentroidsRef.current.happy;
    const sadCenter = trainingCentroidsRef.current.sad;

    const pretrainedHappy = expressions.happy ?? 0;
    const pretrainedSad = expressions.sad ?? 0;
    const pretrainedLabel = pretrainedHappy >= pretrainedSad ? 'happy' : 'sad';
    const pretrainedConfidence = Math.max(pretrainedHappy, pretrainedSad);

    if (!happyCenter || !sadCenter) {
      return {
        label: pretrainedConfidence >= 0.55 ? pretrainedLabel : 'uncertain',
        confidence: pretrainedConfidence,
        pretrainedLabel,
        pretrainedConfidence,
      };
    }

    const happyDistance = euclideanDistance(vector, happyCenter);
    const sadDistance = euclideanDistance(vector, sadCenter);
    const happySimilarity = 1 / (happyDistance + 0.001);
    const sadSimilarity = 1 / (sadDistance + 0.001);
    const totalSimilarity = happySimilarity + sadSimilarity;
    const calibratedHappy = happySimilarity / totalSimilarity;
    const calibratedSad = sadSimilarity / totalSimilarity;

    const finalHappy = (calibratedHappy + pretrainedHappy) / 2;
    const finalSad = (calibratedSad + pretrainedSad) / 2;
    const finalLabel = finalHappy >= finalSad ? 'happy' : 'sad';
    const finalConfidence = Math.max(finalHappy, finalSad);

    return {
      label: finalConfidence >= 0.58 ? finalLabel : 'uncertain',
      confidence: finalConfidence,
      pretrainedLabel,
      pretrainedConfidence,
    };
  };

  const runPrediction = async () => {
    const detection = await detectExpressions();

    if (!detection) {
      setPrediction(null);
      return;
    }

    setPrediction(classifyWithTrainingSet(detection.expressions));
  };

  const startPredictionLoop = () => {
    stopPredictionLoop();
    void runPrediction();
    predictionLoopRef.current = window.setInterval(() => {
      void runPrediction();
    }, DETECTION_INTERVAL_MS);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    setShowResults(true);
    const countdownInterval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          window.clearInterval(countdownInterval);
          onComplete();
        }

        return prev - 1;
      });
    }, 1000);
  };

  if (showResults) {
    return (
      <div className="rounded-3xl border-4 border-green-200 bg-white p-6 text-center shadow-2xl sm:p-8">
        <div className="mb-4 text-6xl animate-bounce">🎉</div>
        <h1 className="mb-4 text-3xl font-bold text-green-700">Computer Vision Lesson Complete!</h1>
        <p className="mb-6 text-xl text-gray-600">
          You used a pretrained face-expression model and personalized it with {sampleCounts.happy + sampleCounts.sad}{' '}
          examples from your own face.
        </p>
        <div className="rounded-2xl bg-green-100 p-4">
          <p className="font-semibold text-green-700">+50 XP Earned!</p>
        </div>
        <div className="mt-4 rounded-2xl bg-green-100 p-4">
          <p className="font-semibold text-green-700">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  const canProceed = currentStep === 0 || (cameraReady && modelsReady && trainingReady);

  return (
    <div className="rounded-3xl border-4 border-blue-200 bg-white p-5 shadow-2xl sm:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-3">
          <Eye className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">Lesson 5: Computer Vision Learning Adventure</h1>
        </div>
        <div className="self-start rounded-full bg-blue-100 px-4 py-2 lg:self-auto">
          <span className="font-semibold text-blue-700">Step {currentStep + 1} of 2</span>
        </div>
      </div>

      {currentStep === 0 ? (
        <div className="space-y-6 text-center">
          <div className="relative">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-6xl animate-pulse">
              👁️
            </div>
            <div className="absolute left-1/2 top-0 mx-auto flex h-10 w-10 -translate-x-[-1.8rem] items-center justify-center rounded-full bg-yellow-400 animate-bounce">
              📷
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">Use a Pretrained Emotion Model</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl">
              This lesson uses face-api.js to detect faces and expressions, then lets you add your own happy and sad
              samples as a personal training set.
            </p>
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 sm:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 text-4xl">🧠</div>
                  <p className="font-semibold">Pretrained model</p>
                  <p className="text-sm text-gray-600">Face-api reads expression probabilities from your webcam</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-4xl">😊</div>
                  <p className="font-semibold">Your own samples</p>
                  <p className="text-sm text-gray-600">You add happy and sad examples to personalize the results</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-4xl">🎯</div>
                  <p className="font-semibold">Live prediction</p>
                  <p className="text-sm text-gray-600">The app blends the base model with your custom training set</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MoodTrainingLab
          cameraError={cameraError}
          cameraReady={cameraReady}
          cameraStarted={cameraStarted}
          isBuildingTrainingSet={isBuildingTrainingSet}
          isLoadingModels={isLoadingModels}
          modelsReady={modelsReady}
          onBuildTrainingSet={buildTrainingSet}
          onCapture={captureSample}
          onLoadModels={loadModels}
          onStartCamera={startCamera}
          prediction={prediction}
          sampleCounts={sampleCounts}
          statusMessage={statusMessage}
          trainingReady={trainingReady}
          videoRef={videoRef}
        />
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center space-x-2 rounded-xl px-8 py-3 text-lg font-bold transition-all duration-200 ${
            canProceed
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-105 hover:from-blue-600 hover:to-cyan-600'
              : 'cursor-not-allowed bg-gray-300 text-gray-500'
          }`}
        >
          <span>{currentStep === 1 ? 'Complete Lesson' : 'Next'}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const MoodTrainingLab: React.FC<{
  cameraError: string;
  cameraReady: boolean;
  cameraStarted: boolean;
  isBuildingTrainingSet: boolean;
  isLoadingModels: boolean;
  modelsReady: boolean;
  onBuildTrainingSet: () => void;
  onCapture: (label: MoodLabel) => void;
  onLoadModels: () => void;
  onStartCamera: () => void;
  prediction: PredictionState | null;
  sampleCounts: Record<MoodLabel, number>;
  statusMessage: string;
  trainingReady: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}> = ({
  cameraError,
  cameraReady,
  cameraStarted,
  isBuildingTrainingSet,
  isLoadingModels,
  modelsReady,
  onBuildTrainingSet,
  onCapture,
  onLoadModels,
  onStartCamera,
  prediction,
  sampleCounts,
  statusMessage,
  trainingReady,
  videoRef,
}) => {
  const totalSamples = sampleCounts.happy + sampleCounts.sad;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-2xl font-bold text-gray-800">Personalized Mood Reader</h3>
        <p className="mx-auto max-w-3xl text-gray-600">
          The pretrained model does the heavy lifting, and your extra examples teach it how your own happy and sad
          expressions look.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-sky-200 bg-slate-950 p-3 shadow-xl sm:p-4">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="aspect-[4/3] w-full scale-x-[-1] rounded-2xl object-cover"
            />
            {!cameraStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 text-white">
                <Camera className="h-12 w-12 text-cyan-300" />
                <p className="text-lg font-semibold">Start the camera to begin</p>
              </div>
            )}
            <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white sm:left-4 sm:top-4 sm:text-sm">
              {cameraReady ? 'Camera live' : 'Camera off'}
            </div>
            {prediction && (
              <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-black/70 p-3 text-white backdrop-blur sm:bottom-4 sm:left-4 sm:right-4 sm:p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200 sm:text-sm">Live Mood Reading</p>
                <p className="mt-1 text-lg font-bold sm:text-2xl">
                  {prediction.label === 'uncertain'
                    ? 'Still deciding'
                    : prediction.label === 'happy'
                      ? 'Happiness detected'
                      : 'Sadness detected'}
                </p>
                <p className="mt-1 text-xs text-slate-200 sm:text-sm">
                  Personalized confidence: {Math.round(prediction.confidence * 100)}%
                </p>
                <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                  Pretrained model saw {prediction.pretrainedLabel} at {Math.round(prediction.pretrainedConfidence * 100)}%
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <ScanFace className="h-8 w-8 text-cyan-700" />
              <div>
                <h4 className="text-lg font-bold text-slate-900">Training Checklist</h4>
                <p className="text-sm text-slate-600">Save at least {MIN_SAMPLES_PER_LABEL} examples for each mood.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Laugh className="h-5 w-5" />
                  <p className="font-semibold">Happy</p>
                </div>
                <p className="mt-2 text-3xl font-bold text-slate-900">{sampleCounts.happy}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-violet-700">
                  <Frown className="h-5 w-5" />
                  <p className="font-semibold">Sad</p>
                </div>
                <p className="mt-2 text-3xl font-bold text-slate-900">{sampleCounts.sad}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Total personal training examples: <span className="font-semibold text-slate-900">{totalSamples}</span>
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h4 className="text-lg font-bold text-slate-900">How to Get Better Results</h4>
            <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
              <p>1. Load the pretrained face-api models, then start the camera.</p>
              <p>2. Keep your face centered and use steady lighting.</p>
              <p>3. Capture a mix of big smiles and clearly sad faces for your own training set.</p>
              <p>4. Build the training set, then test expressions from the same distance.</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-cyan-200/80 bg-[linear-gradient(135deg,rgba(6,182,212,0.14)_0%,rgba(59,130,246,0.12)_34%,rgba(168,85,247,0.14)_68%,rgba(244,114,182,0.14)_100%)] p-4 shadow-[0_16px_40px_rgba(14,165,233,0.14)] sm:p-5">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-6 top-0 h-20 w-20 rounded-full bg-cyan-300/20 blur-2xl"></div>
              <div className="absolute right-0 top-2 h-24 w-24 rounded-full bg-fuchsia-300/20 blur-2xl"></div>
              <div className="absolute bottom-0 left-1/3 h-20 w-20 rounded-full bg-emerald-300/20 blur-2xl"></div>
            </div>
            <div className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">Model Status</p>
                  <h4 className="mt-2 text-xl font-bold text-slate-900">Emotion Engine</h4>
                </div>
                <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm">
                  {trainingReady ? 'Ready' : modelsReady ? 'Calibrating' : 'Loading'}
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-base leading-7 text-slate-700">{statusMessage}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className={`rounded-full px-4 py-2 text-sm font-semibold ${modelsReady ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-600'}`}>
                  {modelsReady ? 'Pretrained model loaded' : 'Waiting for model load'}
                </div>
                <div className={`rounded-full px-4 py-2 text-sm font-semibold ${cameraReady ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'}`}>
                  {cameraReady ? 'Camera connected' : 'Camera not started'}
                </div>
                <div className={`rounded-full px-4 py-2 text-sm font-semibold ${trainingReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {trainingReady ? 'Personalized training set ready' : 'Collecting examples'}
                </div>
              </div>

              {cameraError && (
                <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 shadow-sm">
                  {cameraError}
                </p>
              )}

              {trainingReady && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                  <CheckCircle className="h-4 w-4" />
                  Personalized training set ready
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <button
          type="button"
          onClick={onLoadModels}
          disabled={isLoadingModels || modelsReady}
          className={`rounded-2xl px-4 py-4 text-sm font-semibold transition sm:text-base ${
            isLoadingModels || modelsReady
              ? 'cursor-not-allowed bg-slate-200 text-slate-500'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {isLoadingModels ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {modelsReady ? 'Models Ready' : 'Load Models'}
          </span>
        </button>
        <button
          type="button"
          onClick={onStartCamera}
          disabled={!modelsReady || cameraReady}
          className={`rounded-2xl px-4 py-4 text-sm font-semibold transition sm:text-base ${
            !modelsReady || cameraReady
              ? 'cursor-not-allowed bg-slate-200 text-slate-500'
              : 'bg-sky-500 text-white hover:bg-sky-600'
          }`}
        >
          Start Camera
        </button>
        <button
          type="button"
          onClick={() => onCapture('happy')}
          disabled={!cameraReady}
          className={`rounded-2xl px-4 py-4 text-sm font-semibold transition sm:text-base ${
            cameraReady ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'cursor-not-allowed bg-slate-200 text-slate-400'
          }`}
        >
          Capture Happy
        </button>
        <button
          type="button"
          onClick={() => onCapture('sad')}
          disabled={!cameraReady}
          className={`rounded-2xl px-4 py-4 text-sm font-semibold transition sm:text-base ${
            cameraReady ? 'bg-violet-500 text-white hover:bg-violet-600' : 'cursor-not-allowed bg-slate-200 text-slate-400'
          }`}
        >
          Capture Sad
        </button>
        <button
          type="button"
          onClick={onBuildTrainingSet}
          disabled={!cameraReady || isBuildingTrainingSet}
          className={`rounded-2xl px-4 py-4 text-sm font-semibold transition sm:text-base ${
            !cameraReady || isBuildingTrainingSet
              ? 'cursor-not-allowed bg-slate-200 text-slate-400'
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {isBuildingTrainingSet ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isBuildingTrainingSet ? 'Building...' : 'Use My Training Set'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ComputerVision;
