/**
 * Utility for exporting melodic display to PDF
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export the melodic display to a PDF file
 * @param element - The HTML element to export (melodic-display container)
 * @param filename - The name of the PDF file (default: 'byzantine-melody.pdf')
 */
export const exportToPDF = async (element: HTMLElement, filename: string = 'byzantine-melody.pdf'): Promise<void> => {
  try {
    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      backgroundColor: '#fafafa',
      scale: 2, // Higher quality output
      logging: false,
      useCORS: true,
    });

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate PDF dimensions (A4 landscape orientation for better fit)
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth, imgHeight],
    });

    // Add the canvas as an image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
};
