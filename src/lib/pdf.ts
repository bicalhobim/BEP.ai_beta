import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to the CDN to avoid build issues with Vite/Webpack
// Using unpkg and the .mjs worker for version 4.4.168 to ensure compatibility with ESM
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    // Preserva a estrutura por linha. O pdf.js marca o fim de cada linha com
    // `hasEOL`; juntar todos os itens só com espaço embaralhava tabelas/colunas
    // e fazia a IA não localizar os campos do edital. Mantendo as quebras, o
    // texto fica legível e a extração por seção melhora.
    let pageText = '';
    for (const item of textContent.items as any[]) {
      pageText += item.str ?? '';
      pageText += item.hasEOL ? '\n' : ' ';
    }
    fullText += pageText + '\n\n';
  }

  const text = fullText.trim();
  // PDF digitalizado (imagem) ou protegido não tem camada de texto: a extração
  // volta praticamente vazia e a IA preenche tudo em branco. Sinaliza claramente.
  if (text.replace(/\s/g, '').length < 20) {
    throw new Error(
      'Não foi possível extrair texto do PDF. O arquivo parece ser digitalizado (imagem) ou protegido. ' +
        'Use um PDF pesquisável (com camada de texto) ou rode OCR antes de importar.'
    );
  }
  return text;
}
