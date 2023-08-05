import PDFDocument from 'pdfkit';
import Booking from '../../model/bokingModel.js';



async function ownerRevenue(req, res) {

    try {
        const { from, to } = req.query;
        const ownerId = req.token.index._id
        const doc = new PDFDocument();

        const bookings = await Booking.find({
            refund: false, owner: ownerId,
            bookedAt: {
                $gte: new Date(from),
                $lte: new Date(to),
            }
        }).populate("user").populate('hotel')

        if (bookings.length == 0) {
            console.log("ther is no bookingd");
            return res.status(400).end()
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=booking_report.pdf');

        doc.pipe(res);

        doc.font('Helvetica-Bold').fontSize(20).text('Booking and Revenue Report', { align: 'center' });
        doc.moveDown(0.5);

        // Generate table rows with bookings data
        doc.font('Helvetica').fontSize(10);
        const table = {
            headers: ['User Name', 'Hotel Name', 'Check-in Date', 'Check-out Date', 'Owner Revenue', 'Amount'],
            rows: bookings.map((booking) => [
                booking.user.name,
                booking.hotel.name,
                booking.checkInDate,
                booking.checkOutDate,
                `Rs:${booking.ownerAmount.toFixed(2)}`,
                `Rs:${booking.paymentAmount.toFixed(2)}`,
            ]),
        };

        const tableMargin = 50;
        let startY = doc.y + 50;
        const rowHeight = 30; // Increase row height to add more space
        const colWidth = (doc.page.width - tableMargin * 2) / table.headers.length;

        let rowsPerPage = 8;
        let rowCount = 0;
        let currentPage = 1;

        // Function to start a new page
        const startNewPage = () => {
            doc.addPage();
            startY = 50; // Reset startY for the new page
            rowCount = 0; // Reset rowCount for the new page
            currentPage++;
        };

        // Draw table headers with background color and borders
        doc.fillColor('#F0F0F0').rect(tableMargin, startY, colWidth * table.headers.length, rowHeight).fill();
        drawTableRow(doc, table.headers, tableMargin, startY, colWidth, rowHeight, 'center', true);

        // Draw table rows with borders
        startY += rowHeight;
        table.rows.forEach((row) => {
            if (rowCount >= rowsPerPage) {
                // Start a new page when the rowCount exceeds rowsPerPage
                startNewPage();
                doc.fillColor('#F0F0F0').rect(tableMargin, startY, colWidth * table.headers.length, rowHeight).fill();
                drawTableRow(doc, table.headers, tableMargin, startY, colWidth, rowHeight, 'center', true);
                startY += rowHeight;
            }
            drawTableRow(doc, row, tableMargin, startY, colWidth, rowHeight, 'left', false);
            startY += rowHeight;
            rowCount++;
        });

        // Calculate the total admin revenue and owner revenue
        const totalOwnerRevenue = bookings.reduce((sum, booking) => sum + booking.ownerAmount, 0);
        doc.moveDown(1).font('Helvetica-Bold').fontSize(12);

        // Draw total admin and owner revenues
        const totalRow = ['Total Owner Revenue:', '', '', '', `Rs:${totalOwnerRevenue.toFixed(2)}`, ''];
        if (rowCount >= rowsPerPage) {
            // Start a new page if necessary before drawing the totalRow
            startNewPage();
        }
        drawTableRow(doc, totalRow, tableMargin, startY, colWidth, rowHeight, 'right', true);

        // Calculate the height used by the table and the totalRow
        const tableHeight = (rowCount + 1) * rowHeight; // +1 for the totalRow

        // Draw 'from' and 'to' dates below the total row
        const dateSectionX = tableMargin;
        const dateSectionY = startY + tableHeight + 20; // Add some space (20 units) below the table
        const dateSectionWidth = colWidth * table.headers.length;

        doc.fontSize(12).fillColor('black').text(`From: ${from}`, dateSectionX, dateSectionY);
        doc.fontSize(12).fillColor('black').text(`To: ${to}`, dateSectionX, dateSectionY + 10);

        // End the PDF document
        doc.end();
        return res.status(200).end();
    } catch (error) {
        console.log(error);
    }
}

// Helper function to draw a table row
function drawTableRow(doc, row, x, y, colWidth, rowHeight, align, isHeader) {
    try {
        let startX = x;

        // Set font and font size based on whether it's a header or regular row
        if (isHeader) {
            doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
        } else {
            doc.font('Helvetica').fontSize(10).fillColor('black');
        }

        // Draw each cell of the row with borders
        row.forEach((cell, index) => {
            doc.rect(startX, y, colWidth, rowHeight).stroke();

            // Draw cell content with padding
            doc.text((cell?.toString() || ''), startX + 5, y + 5, { width: colWidth - 10, height: rowHeight - 10, align });

            startX += colWidth;
        });

        // Draw horizontal line for the row
        doc.moveTo(x, y + rowHeight).lineTo(startX, y + rowHeight).stroke();
    } catch (error) {
        console.log(129);
        console.log(error);
    }
}



export default {
    ownerRevenue,
};