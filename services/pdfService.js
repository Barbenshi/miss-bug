const PDFDocument = require('pdfkit');
const fs = require('fs');

module.exports = {
    buildBugsPdf
}

function buildBugsPdf(bugs, filename = 'SaveTheBugs.pdf') {
    console.log(bugs);
    const doc = new PDFDocument();

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream(filename))

    // Embed a font, set the font size, and render some text
    bugs.forEach(({title,description,severity,createdAt}) => {
        doc.fontSize(25);
        doc.text(`Bug name: ${title}`, {
          width: 410,
          align: 'left'
        }
        );
        
        doc.moveDown();
        doc.fontSize(8)
        doc.text(`Severity: ${severity}`, {
          width: 410,
          align: 'center'
        }
        );
        
        doc.moveDown();
        doc.fontSize(14)
        doc.text(`Description: ${description || 'Not described yet'}`, {
          width: 410,
          align: 'center'
        }
        );
        
        doc.moveDown();
        doc.fontSize(8)
        doc.text(`CreatedAt: ${new Date(+createdAt)}`, {
          width: 410,
          align: 'left'
        }
        );
        
        // draw bounding rectangle
        doc.rect(doc.x, 0, 410, doc.y).stroke();
    })

    // Finalize PDF file
    doc.end()
}