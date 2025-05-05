import React, { useState } from "react";
import { Card, CardBody } from "reactstrap";
import moment from "moment";

const ViewModal = ({ title = "Details", fields = [], onEdit }) => {
  const [show, setShow] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleEdit = () => {
    if (onEdit) onEdit();
    handleClose();
  };

  // Format value for display
  const formatValue = (label, value) => {
    if (label.toLowerCase().includes("block")) {
      return value === "true" || value === true ? "Yes" : "No";
    }
    if (label.toLowerCase().includes("valid") || label.toLowerCase().includes("date")) {
      return value ? moment(value).format("DD/MM/YYYY") : "";
    }
    return value || "-";
  };

  // Split fields into triplets for three-column layout
  const getFieldRows = () => {
    const rows = [];
    for (let i = 0; i < fields.length; i += 3) {
      rows.push([fields[i], fields[i + 1], fields[i + 2]]);
    }
    return rows;
  };

  // Custom style for hiding scrollbar
  const hideScrollbarStyle = {
    flex: '1 1 auto',
    minHeight: 0,
    overflowY: 'auto',
    padding: 0,
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE 10+
  };

  // For Webkit browsers
  const webkitScrollbarStyle = `
    .viewmodal-scrollable::-webkit-scrollbar {
      display: none;
    }
  `;

  return (
    <>
      <style>{webkitScrollbarStyle}</style>
      <button
        className="text-primary"
        style={{
          background: "none",
          border: "none",
          padding: "0",
          cursor: "pointer",
        }}
        onClick={handleShow}
        title="View"
      >
        <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
      </button>

      {show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              padding: "0",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopLeftRadius: "14px",
                borderTopRightRadius: "14px",
                background: "#f6f7fa",
                padding: "16px 20px 8px 20px",
                borderBottom: "1px solid #f0f1f3",
                flex: '0 0 auto',
              }}
            >
              <h4 className="card-title mb-0" style={{ fontWeight: 600, fontSize: 16, letterSpacing: 0.2 }}>{title}</h4>
              <button
                onClick={handleClose}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#aaa"
                }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Data Section (Scrollable, no visible scrollbar) */}
            <div
              className="viewmodal-scrollable"
              style={hideScrollbarStyle}
            >
              <Card style={{ margin: 0, border: "none", borderRadius: 0, boxShadow: "none" }}>
                <CardBody style={{ padding: "12px 20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {getFieldRows().map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        style={{
                          display: "flex",
                          alignItems: "stretch",
                          background: hoveredRow === rowIndex ? "#f0f1f3" : rowIndex % 2 === 0 ? "#fafbfc" : "#fff",
                          borderRadius: "6px",
                          marginBottom: 4,
                          padding: "6px 0 6px 0",
                          transition: "background 0.2s",
                          fontSize: 13,
                        }}
                        onMouseEnter={() => setHoveredRow(rowIndex)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        {row.map((data, colIndex) =>
                          data ? (
                            <div
                              key={colIndex}
                              style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                padding: "0 8px",
                              }}
                            >
                              <span style={{ fontWeight: 500, color: "#6c757d", fontSize: 12, marginBottom: 1 }}>
                                {data.label}
                              </span>
                              <span style={{ color: "#212529", fontSize: 13, marginTop: 1 }}>
                                {formatValue(data.label, data.value)}
                              </span>
                            </div>
                          ) : (
                            <div key={colIndex} style={{ flex: 1 }} />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Footer (Buttons) */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                padding: "12px 0 12px 0",
                borderTop: "1px solid #f0f1f3",
                background: "#f6f7fa",
                borderBottomLeftRadius: "14px",
                borderBottomRightRadius: "14px",
                flex: '0 0 auto',
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={handleClose}
                style={{ minWidth: "80px", fontWeight: 500, fontSize: 13, padding: "4px 0" }}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={handleEdit}
                style={{ minWidth: "80px", fontWeight: 500, fontSize: 13, padding: "4px 0" }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewModal;