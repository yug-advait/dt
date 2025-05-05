import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  styled,
  Modal,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  FullscreenExit as FullPageIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Styled components for consistent styling
const BorderedBox = styled(Box)(({ theme }) => ({
  border: "1px solid black",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: "1px solid black",
  padding: theme.spacing(1),
}));

const HeaderTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  fontWeight: "bold",
}));

// Buttons container
const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "@media print": {
    display: "none", // Hide buttons when printing
  },
}));

// Print-optimized container
const PrintContainer = styled("div")(({ theme }) => ({
  width: "100%",
  "@media print": {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    pageBreakInside: "avoid",
    pageBreakAfter: "always",
  },
}));

const TallyTaxInvoice = () => {
  // Reference to the invoice component for printing
  const invoiceRef = useRef(null);

  const [open, setOpen] = useState(false);

  // Add CSS for full-page printing
  useEffect(() => {
    // Create a style element
    const style = document.createElement("style");
    style.id = "invoice-print-styles";

    // Add print-specific CSS rules
    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
        }
        html, body {
          width: 100%;
          height: 100%;
        }
        * {
          box-sizing: border-box;
        }
      }
    `;

    // Append to head
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      const styleElement = document.getElementById("invoice-print-styles");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // This would typically come from props or an API in a real application
  const invoiceData = {
    companyName: "NAVYUG CHEMICALS",
    gstin: "24APZPS7248N1ZO",
    state: "Gujarat",
    stateCode: "24",
    cin: "DSDSD",
    contact: "9429005555",
    address:
      "47,New Ahemdabad Ind. Estate OPP- Vaibhav Auto. Nova Petrolum Lane Sarkhej Bavala Highway. at Moraiya Ta-Sanand, Dist-Ahemdabad",
    udayam: "GJ-01-0156809",
    email: "info@navyugchemical.com",

    consignee: {
      name: "REVA CHEMICALS",
      address: "AMAN WARE HOUSE, CHANGODAR",
      gstin: "24AOQPM6706B1Z1",
      state: "Gujarat",
      stateCode: "24",
      contactPerson: "NILESH BHAI",
      contact: "8585858585",
    },

    supplier: {
      name: "REVA CHEMICALS",
      address: "AMAN WARE HOUSE, CHANGODAR",
      gstin: "24AOQPM6706B1Z1",
      state: "Gujarat",
      stateCode: "24",
      contactPerson: "NILESH BHAI",
      contact: "8585858585",
    },

    invoiceDetails: {
      number: "1",
      date: "1-Apr-25",
      ewayBillNo: "123456",
      billOfLanding: "dt 23-Ar-2023",
      dispatchThrough: "TEMPO",
      orderNo: "001",
      deliveryNote: "Nothing",
    },

    items: [
      {
        description: "AOS",
        quantity: 5000,
        unit: "KGS",
        rate: 40.0,
        amount: 200000.0,
        hsnSac: "27101980",
        gstRate: 18,
      },
      {
        description: "LABSA",
        quantity: 1000,
        unit: "KGS",
        rate: 100.0,
        amount: 100000.0,
        hsnSac: "34029099",
        gstRate: 18,
      },
      {
        description: "LABSA",
        quantity: 1000,
        unit: "KGS",
        rate: 100.0,
        amount: 100000.0,
        hsnSac: "34029099",
        gstRate: 18,
      },
    ],

    additionalDetails: {
      companyGstin: "24AOQPM6706B1Z1",
      buyerPan: "SWQDSASASA",
      transportMode: "By Road",
      vehicleNo: "GJ 05 AZ 1234",
      dateOfSupply: "1-Apr-25",
      placeOfSupply: "Surat",
      payment: "RTGS",
      destination: "Changodar",
      deliveryNoteDate: "Handle With Care Dengerous",
      termsDelivery: "EX MORAIYA",
    },

    bankDetails: {
      accountNo: "05536000004",
      bankName: "THE KALUPUR COMMERCIAL CO-OP,BANK LTD",
      branch: "SOUTH BOPAL, AHMEDABAD & KCCB0SBP055",
    },
  };

  // Use memoization for calculations
  const { totalQuantity, totalAmount, gstData } = useMemo(() => {
    // Calculate total quantity and amount
    const totalQuantity = invoiceData.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalAmount = invoiceData.items.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // Calculate GST
    let totalTaxableValue = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    invoiceData.items.forEach(item => {
      const taxableValue = item.amount;
      totalTaxableValue += taxableValue;

      // Check if IGST or CGST+SGST applies
      const isSameState =
        invoiceData.supplier.stateCode === invoiceData.consignee.stateCode;

      if (isSameState) {
        const cgst = (taxableValue * (item.gstRate / 2)) / 100;
        const sgst = cgst;
        totalCGST += cgst;
        totalSGST += sgst;
      } else {
        const igst = (taxableValue * item.gstRate) / 100;
        totalIGST += igst;
      }
    });

    return {
      totalQuantity,
      totalAmount,
      gstData: {
        totalTaxableValue,
        totalCGST,
        totalSGST,
        totalIGST,
        totalWithGST: totalTaxableValue + totalCGST + totalSGST + totalIGST,
      },
    };
  }, [invoiceData]);

  // Format currency - extract to utility function
  const formatCurrency = amount => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("₹", "");
  };

  // Convert number to words - extract to utility function
  const numberToWords = num => {
    const single = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const double = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const formatTens = num => {
      if (num < 10) return single[num];
      else if (num < 20) return double[num - 10];
      else {
        return (
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + single[num % 10] : "")
        );
      }
    };

    if (num === 0) return "Zero";

    let words = "";

    if (Math.floor(num / 100000) > 0) {
      words += numberToWords(Math.floor(num / 100000)) + " Lakh ";
      num %= 100000;
    }

    if (Math.floor(num / 1000) > 0) {
      words += numberToWords(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }

    if (Math.floor(num / 100) > 0) {
      words += single[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }

    if (num > 0) {
      words += formatTens(num);
    }

    return words.trim();
  };

  // Data for invoice details sections
  const leftColumnData = [
    { label: "Invoice No:", value: invoiceData.invoiceDetails.number },
    { label: "e-Way Bill No:", value: invoiceData.invoiceDetails.ewayBillNo },
    { label: "Delivery Note:", value: invoiceData.invoiceDetails.deliveryNote },
    { label: "Buyer's Order No.:", value: invoiceData.invoiceDetails.orderNo },
    {
      label: "Dispatch Through:",
      value: invoiceData.invoiceDetails.dispatchThrough,
    },
    {
      label: "Bill of Landing:",
      value: invoiceData.invoiceDetails.billOfLanding,
    },
  ];

  const rightColumnData = [
    { label: "Mode of Payment:", value: invoiceData.additionalDetails.payment },
    {
      label: "Other References:",
      value: invoiceData.additionalDetails.otherReferences,
    },
    { label: "Dated:", value: invoiceData.additionalDetails.otherDate },
    {
      label: "Delivery Note Date:",
      value: invoiceData.additionalDetails.deliveryNoteDate,
    },
    { label: "Destination:", value: invoiceData.additionalDetails.destination },
    {
      label: "Mode of Transport:",
      value: invoiceData.additionalDetails.transportMode,
    },
    { label: "Vehicle No:", value: invoiceData.additionalDetails.vehicleNo },
  ];

  // Component for field sections
  const DetailField = ({ label, value }) => (
    <Box
      sx={{
        pl: 1,
        borderBottom: "1px solid black",
        borderRight: "1px solid black",
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body2">{value || ""}</Typography>
    </Box>
  );

  // Component for address sections
  const AddressSection = ({ title, data }) => (
    <Box sx={{ borderBottom: "1px solid black" }}>
      <Typography variant="body2">{title}</Typography>
      <Typography variant="body1" fontWeight="bold">
        {data.name}
      </Typography>
      <Typography variant="body2">{data.address}</Typography>
      <Typography variant="body2">GSTIN: {data.gstin}</Typography>
      <Typography variant="body2">
        State Name: {data.state}, Code: {data.stateCode}
      </Typography>
      <Typography variant="body2">
        Contact Person: {data.contactPerson}
      </Typography>
      <Typography variant="body2">Contact: {data.contact}</Typography>
    </Box>
  );

  // Print functionality with full page support
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${invoiceData.invoiceDetails.number}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .MuiContainer-root {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `,
    onBeforeGetContent: () => {
      // Prepare the document for full page printing
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Print completed");
    },
  });

  const handleDownload = async () => {
    const invoice = invoiceRef.current;
    const scale = 2;
  
    const canvas = await html2canvas(invoice, {
      scale,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });
  
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [210, 297], // A4
      compress: true,
    });
  
    const pageWidth = 210;
    const pageHeight = 297;
    const padding = 10; // in mm
  
    const pdfWidth = pageWidth - padding * 2;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
    if (imgHeight + padding * 2 > pageHeight) {
      let position = 0;
  
      while (position < imgHeight) {
        pdf.addImage(
          imgData,
          "PNG",
          padding,                       // X position with padding
          padding - position,           // Y position (adjusted per page)
          pdfWidth,                     // Reduced width
          imgHeight
        );
  
        position += pageHeight - padding * 2;
  
        if (position < imgHeight) {
          pdf.addPage([210, 297]);
        }
      }
    } else {
      pdf.addImage(
        imgData,
        "PNG",
        padding,       // X padding
        padding,       // Y padding
        pdfWidth,
        imgHeight
      );
    }
  
    pdf.save(`Invoice_${invoiceData.invoiceDetails.number}.pdf`);
  };
  

  return (
    <>
      {/* Action Buttons */}
      <ActionsContainer sx={{ mt: "150px" }}>
        <Tooltip title="View the invoice as a full page PDF">
          <IconButton color="secondary" onClick={() => setOpen(true)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </ActionsContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflow: "auto",
            width: "70vw", // or set a specific width like 800px
            borderRadius: 2,
          }}
        >
          <Tooltip title="Download the invoice as a full page PDF">
            <IconButton color="secondary" onClick={handleDownload}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <PrintContainer ref={invoiceRef}>
            <Container
              maxWidth="md"
              sx={{
                d: "none",
                width: "100vw",
                mt: "15px",
                mb: 4,
                p: 0,
                border: "1px solid black",
                pageBreakInside: "avoid",
              }}
            >
              {/* Header */}
              <Box
                textAlign="center"
                p={1}
                sx={{ borderBottom: "1px solid black" }}
              >
                <Typography variant="h4" fontWeight="bold">
                  TAX INVOICE
                </Typography>
              </Box>

              {/* Company and Invoice Details Grid */}
              <Grid container>
                {/* Left Side - Company and Parties */}
                <Grid item xs={6} p={1}>
                  {/* Company Details */}
                  <Box sx={{ borderBottom: "1px solid black" }}>
                    <Typography fontWeight="bold" gutterBottom>
                      {invoiceData.companyName}
                    </Typography>
                    <Typography variant="body2">
                      {invoiceData.address}
                    </Typography>
                    <Typography variant="body2">
                      UDAYAM REG NO: {invoiceData.udayam}
                    </Typography>
                    <Typography variant="body2">
                      EMAIL: {invoiceData.email}
                    </Typography>
                    <Typography variant="body2">
                      GSTIN: {invoiceData.gstin}
                    </Typography>
                    <Typography variant="body2">
                      State Name: {invoiceData.state}, Code:{" "}
                      {invoiceData.stateCode}
                    </Typography>
                  </Box>

                  {/* Consignee (Ship To) */}
                  <AddressSection
                    title="Consignee (Ship to)"
                    data={invoiceData.consignee}
                  />

                  {/* Supplier (Bill From) */}
                  <AddressSection
                    title="Supplier (Bill from)"
                    data={invoiceData.supplier}
                  />
                </Grid>

                {/* Right Side - Invoice Details */}
                <Grid item xs={6} sx={{ borderLeft: "1px solid black" }}>
                  <Grid container>
                    {/* Left Column */}
                    <Grid item xs={6}>
                      {leftColumnData.map((item, idx) => (
                        <DetailField
                          key={idx}
                          label={item.label}
                          value={item.value}
                        />
                      ))}
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={6}>
                      {rightColumnData.map((item, idx) => (
                        <DetailField
                          key={idx}
                          label={item.label}
                          value={item.value}
                        />
                      ))}
                    </Grid>

                    <Grid item xs={12}>
                      <DetailField
                        label="Terms of Delivery:"
                        value={invoiceData.additionalDetails.termsDelivery}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Items Table */}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <HeaderTableCell align="center" width="5%">
                        Sl No.
                      </HeaderTableCell>
                      <HeaderTableCell width="50%">
                        Description of Goods
                      </HeaderTableCell>
                      <HeaderTableCell align="center" width="10%">
                        HSN/SAC
                      </HeaderTableCell>
                      <HeaderTableCell align="right" width="10%">
                        Quantity
                      </HeaderTableCell>
                      <HeaderTableCell align="right" width="10%">
                        Rate
                      </HeaderTableCell>
                      <HeaderTableCell align="center" width="10%">
                        per
                      </HeaderTableCell>
                      <HeaderTableCell align="right" width="15%">
                        Amount
                      </HeaderTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceData.items.map((item, index) => (
                      <TableRow key={index}>
                        <StyledTableCell align="center">
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell>{item.description}</StyledTableCell>
                        <StyledTableCell align="center">
                          {item.hsnSac}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {item.quantity} {item.unit}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {item.rate.toFixed(2)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {item.unit}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {formatCurrency(item.amount)}
                        </StyledTableCell>
                      </TableRow>
                    ))}

                    {/* Show subtotal of items */}
                    <TableRow>
                      <StyledTableCell
                        colSpan={6}
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Sub Total:
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {formatCurrency(totalAmount)}
                      </StyledTableCell>
                    </TableRow>

                    {/* Display CGST and SGST only if same state */}
                    {invoiceData.supplier.stateCode ===
                      invoiceData.consignee.stateCode && (
                      <>
                        <TableRow>
                          <StyledTableCell colSpan={5} align="right">
                            CGST @ {invoiceData.items[0].gstRate / 2}%
                          </StyledTableCell>
                          <StyledTableCell colSpan={1}></StyledTableCell>
                          <StyledTableCell align="right">
                            {formatCurrency(gstData.totalCGST)}
                          </StyledTableCell>
                        </TableRow>
                        <TableRow>
                          <StyledTableCell colSpan={5} align="right">
                            SGST @ {invoiceData.items[0].gstRate / 2}%
                          </StyledTableCell>
                          <StyledTableCell colSpan={1}></StyledTableCell>
                          <StyledTableCell align="right">
                            {formatCurrency(gstData.totalSGST)}
                          </StyledTableCell>
                        </TableRow>
                      </>
                    )}

                    {/* Display IGST if different state */}
                    {invoiceData.supplier.stateCode !==
                      invoiceData.consignee.stateCode && (
                      <TableRow>
                        <StyledTableCell colSpan={5} align="right">
                          IGST @ {invoiceData.items[0].gstRate}%
                        </StyledTableCell>
                        <StyledTableCell colSpan={1}></StyledTableCell>
                        <StyledTableCell align="right">
                          {formatCurrency(gstData.totalIGST)}
                        </StyledTableCell>
                      </TableRow>
                    )}

                    {/* Grand Total */}
                    <TableRow>
                      <StyledTableCell
                        colSpan={3}
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Total
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        {totalQuantity} KGS
                      </StyledTableCell>
                      <StyledTableCell colSpan={1}></StyledTableCell>
                      <StyledTableCell
                        colSpan={1}
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Grand Total:
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        {formatCurrency(gstData.totalWithGST)}
                      </StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Totals and GST */}
              <Grid container sx={{ borderTop: "1px solid black" }}>
                <Grid item xs={12} p={1}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Amount Chargeable (in words)
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    INR {numberToWords(Math.round(gstData.totalWithGST))} Only
                  </Typography>

                  {/* HSN Summary Table */}
                  <Box mt={2}>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <HeaderTableCell align="center">
                              HSN/SAC
                            </HeaderTableCell>
                            <HeaderTableCell align="right">
                              Taxable Value
                            </HeaderTableCell>
                            <HeaderTableCell align="center">
                              CGST Rate
                            </HeaderTableCell>
                            <HeaderTableCell align="right">
                              CGST Amount
                            </HeaderTableCell>
                            <HeaderTableCell align="center">
                              SGST Rate
                            </HeaderTableCell>
                            <HeaderTableCell align="right">
                              SGST Amount
                            </HeaderTableCell>
                            <HeaderTableCell align="right">
                              Total Tax Amount
                            </HeaderTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Group items by HSN code */}
                          {Object.entries(
                            invoiceData.items.reduce((acc, item) => {
                              if (!acc[item.hsnSac]) {
                                acc[item.hsnSac] = {
                                  amount: 0,
                                  gstRate: item.gstRate,
                                };
                              }
                              acc[item.hsnSac].amount += item.amount;
                              return acc;
                            }, {})
                          ).map(([hsnSac, data], index) => {
                            const cgstAmount =
                              (data.amount * (data.gstRate / 2)) / 100;
                            const sgstAmount =
                              (data.amount * (data.gstRate / 2)) / 100;
                            const totalTax = cgstAmount + sgstAmount;

                            return (
                              <TableRow key={index}>
                                <StyledTableCell align="center">
                                  {hsnSac}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formatCurrency(data.amount)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {data.gstRate / 2}%
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formatCurrency(cgstAmount)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {data.gstRate / 2}%
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formatCurrency(sgstAmount)}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formatCurrency(totalTax)}
                                </StyledTableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <StyledTableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Total
                            </StyledTableCell>
                            <StyledTableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              {formatCurrency(gstData.totalTaxableValue)}
                            </StyledTableCell>
                            <StyledTableCell align="center"></StyledTableCell>
                            <StyledTableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              {formatCurrency(gstData.totalCGST)}
                            </StyledTableCell>
                            <StyledTableCell align="center"></StyledTableCell>
                            <StyledTableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              {formatCurrency(gstData.totalSGST)}
                            </StyledTableCell>
                            <StyledTableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              {formatCurrency(
                                gstData.totalCGST + gstData.totalSGST
                              )}
                            </StyledTableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                    Tax Amount (in words): INR{" "}
                    {numberToWords(
                      Math.round(gstData.totalCGST + gstData.totalSGST)
                    )}{" "}
                    Only
                  </Typography>
                </Grid>

                <Grid item xs={8} sx={{ borderBottom: "1px solid black" }}>
                  <Box p={1} sx={{ borderTop: "1px solid black" }}>
                    <Typography variant="body2" fontStyle="italic">
                      Declaration: Kindly confirm that, this invoice is
                      reflecting in your GSTR 2B with correct amount and other
                      details. If there is any discrepancy between this invoice
                      and GSTR 2B report kindly contact us immediately through
                      E-mail and phone mention on this invoice before 30th June
                      of next financial year for necessary adjustments.
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={4}
                  sx={{
                    borderBottom: "1px solid black",
                    borderLeft: "1px solid black",
                    borderTop: "1px solid black",
                  }}
                >
                  {/* Bank Details */}
                  <Box p={1}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Company&lsquo;s Bank Details
                    </Typography>
                    <Typography variant="body2">
                      A/c No.: {invoiceData.bankDetails.accountNo}
                    </Typography>
                    <Typography variant="body2">
                      Bank Name: {invoiceData.bankDetails.bankName}
                    </Typography>
                    <Typography variant="body2">
                      Branch: {invoiceData.bankDetails.branch}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Declaration and Signature */}
              <Box p={1} mt={2} display="flex" justifyContent="space-between">
                <Typography variant="body1">E. & O.E</Typography>
                <Box textAlign="right">
                  <Typography variant="body1" fontWeight="bold">
                    for {invoiceData.companyName}
                  </Typography>
                  <Box mt={5}>
                    <Typography variant="body1">
                      Authorised Signatory
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Container>
          </PrintContainer>
        </Box>
      </Modal>
    </>
  );
};

export default TallyTaxInvoice;
