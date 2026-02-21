interface FirebaseUser {
  email: string | null;
  multiFactor: {
    enrolledFactors: Array<{ uid: string }>;
    getSession: () => Promise<unknown>;
    enroll: (assertion: unknown, displayName?: string) => Promise<void>;
  };
}

interface FirebaseResolver {
  hints: Array<{ uid: string }>;
  session: unknown;
  resolveSignIn: (assertion: unknown) => Promise<void>;
}

interface FirebaseAuthInstance {
  currentUser: FirebaseUser | null;
  signInWithPopup: (provider: unknown) => Promise<{ user: FirebaseUser }>;
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => () => void;
  signOut: () => Promise<void>;
}

interface FirebaseAuthNamespace {
  GoogleAuthProvider: new () => {
    setCustomParameters: (params: Record<string, string>) => void;
  };
  PhoneAuthProvider: {
    credential: (verificationId: string, verificationCode: string) => unknown;
    new (auth: FirebaseAuthInstance): {
      verifyPhoneNumber: (options: unknown, verifier: unknown) => Promise<string>;
    };
  };
  PhoneMultiFactorGenerator: {
    assertion: (credential: unknown) => unknown;
  };
  RecaptchaVerifier: new (containerId: string, options: unknown) => unknown;
  getMultiFactorResolver: (error: unknown) => FirebaseResolver;
}

interface FirebaseCompat {
  apps: unknown[];
  initializeApp: (config: Record<string, string | undefined>) => void;
  auth: FirebaseAuthNamespace & (() => FirebaseAuthInstance);
}

const getFirebaseCompat = (): FirebaseCompat => {
  const firebaseCompat = window.firebase;

  if (!firebaseCompat) {
    throw new Error('Firebase SDK is not loaded.');
  }

  return firebaseCompat as FirebaseCompat;
};

const defaultFirebaseConfig = {
  apiKey: 'AIzaSyBjoLQLQKh85WjRXpAM1oCs5nrdpYE9Co4',
  authDomain: 'miniailearn.firebaseapp.com',
  projectId: 'miniailearn',
  appId: '1:962865619528:web:669dfad0aa9d703ebbae7d',
  messagingSenderId: '962865619528',
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? defaultFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? defaultFirebaseConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? defaultFirebaseConfig.appId,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? defaultFirebaseConfig.messagingSenderId,
};

let recaptchaVerifier: unknown;

const ensureAppInitialized = () => {
  const firebaseCompat = getFirebaseCompat();

  if (!firebaseCompat.apps.length) {
    firebaseCompat.initializeApp(firebaseConfig);
  }

  return firebaseCompat;
};

export const getAuth = () => ensureAppInitialized().auth();

export const signInWithGoogle = async () => {
  const firebaseCompat = ensureAppInitialized();
  const auth = firebaseCompat.auth();
  const provider = new firebaseCompat.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  return auth.signInWithPopup(provider);
};

const getRecaptchaVerifier = (containerId: string) => {
  const firebaseCompat = ensureAppInitialized();

  if (!recaptchaVerifier) {
    recaptchaVerifier = new firebaseCompat.auth.RecaptchaVerifier(containerId, { size: 'invisible' });
  }

  return recaptchaVerifier;
};

export const startPhoneEnrollment = async (
  phoneNumber: string,
  session: unknown,
  containerId: string,
) => {
  const firebaseCompat = ensureAppInitialized();
  const auth = firebaseCompat.auth();
  const verifier = getRecaptchaVerifier(containerId);
  const provider = new firebaseCompat.auth.PhoneAuthProvider(auth);

  return provider.verifyPhoneNumber({ phoneNumber, session }, verifier);
};

export const finalizePhoneEnrollment = async (
  verificationId: string,
  verificationCode: string,
  displayName: string,
) => {
  const firebaseCompat = ensureAppInitialized();
  const auth = firebaseCompat.auth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('No authenticated user found for 2FA enrollment.');
  }

  const credential = firebaseCompat.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
  const assertion = firebaseCompat.auth.PhoneMultiFactorGenerator.assertion(credential);

  await currentUser.multiFactor.enroll(assertion, displayName);
};

export const getMultiFactorResolver = (error: unknown) => {
  const firebaseCompat = ensureAppInitialized();
  return firebaseCompat.auth.getMultiFactorResolver(error);
};

export const startMfaSignIn = async (
  resolver: FirebaseResolver,
  phoneHintUid: string,
  containerId: string,
) => {
  const firebaseCompat = ensureAppInitialized();
  const auth = firebaseCompat.auth();
  const provider = new firebaseCompat.auth.PhoneAuthProvider(auth);
  const verifier = getRecaptchaVerifier(containerId);
  const hint = resolver.hints.find((factor) => factor.uid === phoneHintUid);

  if (!hint) {
    throw new Error('No phone factor available for this account.');
  }

  return provider.verifyPhoneNumber({ multiFactorHint: hint, session: resolver.session }, verifier);
};

export const completeMfaSignIn = async (
  resolver: FirebaseResolver,
  verificationId: string,
  verificationCode: string,
) => {
  const firebaseCompat = ensureAppInitialized();
  const credential = firebaseCompat.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
  const assertion = firebaseCompat.auth.PhoneMultiFactorGenerator.assertion(credential);

  return resolver.resolveSignIn(assertion);
};
