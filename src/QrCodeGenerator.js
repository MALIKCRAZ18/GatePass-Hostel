import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsQR from "jsqr";
import "./global.css"; // Ensure this is properly linked

const QRCodeGenerator = ({ leaveData }) => {
    const qrRef = useRef(null);
    const [scannedData, setScannedData] = useState(null);

    const isNotPending = leaveData[0].status !== "Pending";

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector("canvas");
        if (!canvas) return;

        const borderSize = 20;
        const newCanvas = document.createElement("canvas");
        const newCtx = newCanvas.getContext("2d");

        const size = canvas.width + borderSize * 2;
        newCanvas.width = size;
        newCanvas.height = size;

        newCtx.fillStyle = "yellow";
        newCtx.fillRect(0, 0, size, size);
        newCtx.drawImage(canvas, borderSize, borderSize);

        const pngUrl = newCanvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "qrcode.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const scanDisplayedQRCode = () => {
        const canvas = qrRef.current.querySelector("canvas");
        if (!canvas) return alert("QR code not found!");

        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
            try {
                const parsedData = JSON.parse(qrCode.data);
                setScannedData(parsedData[0]);
            } catch (error) {
                alert("Invalid QR Code format.");
            }
        } else {
            alert("Failed to scan QR Code.");
        }
    };

    return (
        <div className="container text-center">
            {isNotPending ? (
                <>
                    <h2 className="text-warning">Your QR Code</h2>

                    <div ref={qrRef} className="qr-container">
                        <QRCodeCanvas value={JSON.stringify(leaveData)} size={256} />
                    </div>

                    <div className="button-group">
                        <button className="btn btn-warning" onClick={downloadQRCode}>
                            Download QR Code
                        </button>
                        <button className="btn btn-warning" onClick={scanDisplayedQRCode}>
                            Scan Displayed QR Code
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-white">Application under process</div>
            )}

            {scannedData && (
                <div
                    key={scannedData.id}
                    className={`card text-white mt-3 ${
                        scannedData.status === "approved" ? "bg-success" : "bg-danger"
                    }`}
                >
                    <div className="card-body">
                        <h5 className="card-title">Leave Type: {scannedData.leave_type.toUpperCase()}</h5>
                        <p className="card-text">
                            <strong>Visiting Place:</strong> {scannedData.visiting_place} <br />
                            <strong>From:</strong> {new Date(scannedData.from_date).toLocaleDateString()} at{" "}
                            {scannedData.from_time} <br />
                            <strong>To:</strong> {new Date(scannedData.to_date).toLocaleDateString()} at{" "}
                            {scannedData.to_time} <br />
                            <strong>Reason:</strong> {scannedData.reason} <br />
                            <strong>Status:</strong> {scannedData.status.toUpperCase()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;
