import { jsPDF } from 'jspdf';

const loadImageAsDataUrl = async (src: string) => {
  const response = await fetch(src);
  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read certificate image.'));
    reader.readAsDataURL(blob);
  });
};

export const downloadMiniAICertificate = async (studentName: string) => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'letter',
  });

  pdf.setFillColor(238, 253, 245);
  pdf.rect(0, 0, 792, 612, 'F');

  pdf.setDrawColor(16, 185, 129);
  pdf.setLineWidth(6);
  pdf.roundedRect(28, 28, 736, 556, 24, 24, 'S');

  pdf.setDrawColor(110, 231, 183);
  pdf.setLineWidth(2);
  pdf.roundedRect(46, 46, 700, 520, 20, 20, 'S');

  try {
    const logoDataUrl = await loadImageAsDataUrl('/images/miniAiElement.png');
    pdf.addImage(logoDataUrl, 'PNG', 346, 72, 100, 100);
  } catch {
    pdf.setFillColor(16, 185, 129);
    pdf.circle(396, 122, 38, 'F');
  }

  pdf.setTextColor(6, 95, 70);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(18);
  pdf.text('MiniAI Learn', 396, 205, { align: 'center' });

  pdf.setFont('times', 'bold');
  pdf.setFontSize(30);
  pdf.text('Certificate of Completion', 396, 252, { align: 'center' });

  pdf.setFont('times', 'normal');
  pdf.setFontSize(18);
  pdf.text('Congratulations on completing', 396, 292, { align: 'center' });

  pdf.setFont('times', 'bold');
  pdf.setFontSize(24);
  pdf.text('MiniAI Learn -> Introduction to AI Principles', 396, 328, { align: 'center' });

  pdf.setFont('times', 'italic');
  pdf.setFontSize(28);
  pdf.text(studentName, 396, 388, { align: 'center' });

  pdf.setFont('times', 'normal');
  pdf.setFontSize(16);
  pdf.text('has completed every learning adventure and AI challenge in MiniAI.', 396, 422, { align: 'center' });

  pdf.setDrawColor(16, 185, 129);
  pdf.setLineWidth(1.5);
  pdf.line(250, 470, 542, 470);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 23, 42);
  pdf.text(`Awarded on ${new Date().toLocaleDateString()}`, 396, 492, { align: 'center' });

  pdf.save(`${studentName.replace(/\s+/g, '-').toLowerCase()}-miniai-certificate.pdf`);
};
