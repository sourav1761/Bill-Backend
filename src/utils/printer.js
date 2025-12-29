import escpos from "escpos";
import usb from "escpos-usb";

escpos.USB = usb;

// Thermal printer setup for XP-365B / XP-350B
class ThermalPrinter {
  constructor() {
    this.device = null;
    this.printer = null;
  }

  async connect() {
    try {
      const devices = usb.find();

      if (!devices || devices.length === 0) {
        throw new Error("No USB thermal printer found");
      }

      this.device = new escpos.USB(devices[0]);
      this.printer = new escpos.Printer(this.device, {
        encoding: "GB18030",
      });

      console.log("✅ Thermal printer connected");
    } catch (err) {
      console.error("❌ Printer connection failed:", err);
      throw err;
    }
  }

  async open() {
    if (!this.printer) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.device.open((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.printer.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // ===============================
  // PRINT QR LABEL (≈50x25mm)
  // ===============================
  async printQRLabel(product) {
    try {
      await this.open();

      const p = this.printer;

      p.align("CT")
        .style("B")
        .size(1, 1)
        .text(process.env.SHOP_NAME || "RAJSHREE COLLECTION")
        .style("NORMAL")
        .drawLine();

      p.align("LT")
        .size(0, 0)
        .text(`Name: ${product.name.substring(0, 20)}`)
        .text(`Size: ${product.size}`)
        .text(`MRP: ₹${product.mrp}`);

      if (product.rcp && product.rcp !== product.mrp) {
        p.text(`RCP: ₹${product.rcp}`);
      }

      p.drawLine();

      // 🔥 SMALL & SHARP QR (THERMAL PERFECT)
      p.align("CT").qrimage(product.qrData, {
        type: "png",
        size: 3,          // controls physical QR size
        ec_level: "L",    // sharp print
      });

      p.feed(1).cut();

      await this.close();

      console.log("✅ QR label printed");
      return true;
    } catch (err) {
      console.error("❌ QR label print failed:", err);
      throw err;
    }
  }

  // ===============================
  // PRINT BILL RECEIPT
  // ===============================
  async printBill(bill) {
    try {
      await this.open();

      const p = this.printer;

      p.align("CT")
        .style("B")
        .text(process.env.SHOP_NAME || "RAJSHREE COLLECTION")
        .style("NORMAL")
        .text(process.env.SHOP_ADDRESS || "")
        .text(process.env.SHOP_CONTACT || "")
        .drawLine()
        .align("LT");

      p.text(`Bill No: ${bill.billNumber}`)
        .text(`Date: ${bill.date}`)
        .drawLine();

      bill.items.forEach((item) => {
        p.text(
          `${item.name.substring(0, 15)} ${item.size}`.padEnd(20) +
          `${item.quantity}`.padEnd(4) +
          `₹${item.rcp}`
        );
      });

      p.drawLine()
        .style("B")
        .text(`TOTAL: ₹${bill.total}`)
        .style("NORMAL")
        .feed(2)
        .text("Thank you for shopping!")
        .feed(3)
        .cut();

      await this.close();

      console.log("✅ Bill printed");
      return true;
    } catch (err) {
      console.error("❌ Bill print failed:", err);
      throw err;
    }
  }
}

export const printer = new ThermalPrinter();



