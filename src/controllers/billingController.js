import Bill from '../models/Bill.js';
import Product from '../models/Product.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

// Create new bill
export const createBill = async (req, res) => {
  try {
    const { items, customerName, whatsappNumber } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;
    
    // Process each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      // Calculate item totals
      const itemMrpTotal = product.mrp * item.quantity;
      const itemRcpTotal = product.rcp * item.quantity;
      const itemDiscount = itemMrpTotal - itemRcpTotal;
      
      item.mrp = product.mrp;
      item.rcp = product.rcp;
      item.total = itemRcpTotal;
      item.name = product.name;
      item.size = product.size;
      
      subtotal += itemMrpTotal;
      totalDiscount += itemDiscount;
    }

    const total = subtotal - totalDiscount;

    // Create bill
    const bill = new Bill({
      items,
      subtotal,
      discount: totalDiscount,
      total,
      customerName,
      whatsappNumber
    });

    const savedBill = await bill.save();

    res.status(201).json({
      success: true,
      bill: savedBill
    });

  } catch (error) {
    console.error('CREATE BILL ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating bill',
      error: error.message
    });
  }
};

// Other functions remain the same, just remove any code references
// Get bill by ID
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      bill
    });

  } catch (error) {
    console.error('GET BILL ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Generate bill PDF
export const generateBillPDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bill = await Bill.findById(id)
      .populate('items.productId', 'name size');
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Create PDF
    const doc = new PDFDocument({ size: 'A6', margin: 10 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bill-${bill.billNumber}.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(14).font('Helvetica-Bold').text(process.env.SHOP_NAME || 'RAJSHREE COLLECTION', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(8).font('Helvetica').text(process.env.SHOP_ADDRESS || '', { align: 'center' });
    doc.text(process.env.SHOP_CONTACT || '', { align: 'center' });
    doc.text(`GSTIN: ${process.env.GSTIN || 'Not Available'}`, { align: 'center' });
    
    doc.moveDown();
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
    doc.moveDown(0.5);

    // Bill Info
    doc.fontSize(9).font('Helvetica');
    doc.text(`Bill No: ${bill.billNumber}`, { continued: true });
    doc.text(`Date: ${bill.date.toLocaleDateString()}`, { align: 'right' });
    doc.text(`Time: ${bill.date.toLocaleTimeString()}`, { align: 'right' });
    
    if (bill.customerName) {
      doc.text(`Customer: ${bill.customerName}`);
    }
    
    doc.moveDown();
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
    doc.moveDown(0.5);

    // Items Table Header
    const startY = doc.y;
    doc.fontSize(8).font('Helvetica-Bold');
    doc.text('Item', 10, startY);
    doc.text('Qty', 150, startY);
    doc.text('Rate', 180, startY);
    doc.text('Amount', 220, startY);
    
    doc.moveTo(doc.page.margins.left, doc.y + 5).lineTo(doc.page.width - doc.page.margins.right, doc.y + 5).stroke();
    doc.moveDown();

    // Items
    doc.fontSize(8).font('Helvetica');
    let y = doc.y;
    
    bill.items.forEach((item, index) => {
      const productName = item.name || (item.productId && item.productId.name) || 'N/A';
      const size = item.size || (item.productId && item.productId.size) || '';
      
      doc.text(`${productName} ${size}`, 10, y);
      doc.text(item.quantity.toString(), 150, y);
      doc.text(`₹${item.rcp.toFixed(2)}`, 180, y);
      doc.text(`₹${item.total.toFixed(2)}`, 220, y);
      
      y += 15;
      
      // Show MRP and discount per item
      doc.fontSize(6).font('Helvetica-Oblique');
      const discount = (item.mrp * item.quantity) - item.total;
      doc.text(`MRP: ₹${item.mrp} (Save: ₹${discount.toFixed(2)})`, 10, y);
      doc.fontSize(8).font('Helvetica');
      y += 10;
    });

    doc.y = y + 10;
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
    doc.moveDown();

    // Totals
    doc.fontSize(9).font('Helvetica');
    doc.text(`Subtotal:`, { continued: true });
    doc.text(`₹${bill.subtotal.toFixed(2)}`, { align: 'right' });
    
    doc.text(`Discount:`, { continued: true });
    doc.text(`- ₹${bill.discount.toFixed(2)}`, { align: 'right' });
    
    doc.moveDown(0.5);
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Total Amount:`, { continued: true });
    doc.text(`₹${bill.total.toFixed(2)}`, { align: 'right' });

    doc.moveDown(2);
    doc.fontSize(8).font('Helvetica');
    doc.text('Thank you for shopping with us!', { align: 'center' });
    doc.text('Please visit again', { align: 'center' });

    // Generate QR for bill
    const qrData = {
      billNumber: bill.billNumber,
      date: bill.date,
      total: bill.total
    };
    
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
    
    // Add QR code to PDF if space permits
    doc.moveDown();
    doc.image(qrCode, doc.page.width / 2 - 50, doc.y, { width: 100 });
    doc.moveDown(6);
    doc.fontSize(6).text('Scan QR for bill verification', { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('GENERATE PDF ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const bills = await Bill.find(query).sort({ date: -1 });
    
    res.json({
      success: true,
      count: bills.length,
      bills
    });

  } catch (error) {
    console.error('GET ALL BILLS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get sales summary
export const getSalesSummary = async (req, res) => {
  try {
    const { period } = req.query; // 'today', 'month', 'year', 'custom'
    let startDate, endDate = new Date();

    switch (period) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate = new Date(new Date().getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const bills = await Bill.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const summary = {
      totalBills: bills.length,
      totalSales: bills.reduce((sum, bill) => sum + bill.total, 0),
      totalDiscount: bills.reduce((sum, bill) => sum + bill.discount, 0),
      totalItems: bills.reduce((sum, bill) => {
        return sum + bill.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0),
      averageBillValue: bills.length > 0 ? 
        bills.reduce((sum, bill) => sum + bill.total, 0) / bills.length : 0
    };

    res.json({
      success: true,
      period,
      startDate,
      endDate,
      summary
    });

  } catch (error) {
    console.error('SALES SUMMARY ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};