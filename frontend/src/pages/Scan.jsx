import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/axios";
import toast from "react-hot-toast";

export default function Scan() {

  const scannerRef = useRef(null);
  const lastScannedRef = useRef(null);

  const readerId = "reader";

  const [isProcessing, setIsProcessing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const [markedStudents, setMarkedStudents] = useState([]);

  /* ================= LOAD ATTENDANCE FROM DATABASE ================= */

  useEffect(() => {

    const loadAttendance = async () => {

      try {

        const res = await api.get("/attendance/list");

        const formatted = res.data.map((s) => ({
          name: s.name,
          time: new Date(s.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }));

        setMarkedStudents(formatted);

      } catch (err) {

        console.log("Attendance fetch error");

      }

    };

    loadAttendance();
    startScanner();

    return () => {
      stopScanner();
    };

  }, []);

  /* ================= START SCANNER ================= */

  const startScanner = async () => {

    try {

      const scanner = new Html5Qrcode(readerId);

      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        handleScan
      );

      setIsActive(true);

    } catch (err) {

      console.error(err);
      toast.error("Camera failed to start");

    }

  };

  /* ================= HANDLE SCAN ================= */

  const handleScan = async (decodedText) => {

    if (isProcessing) return;

    let finalValue = decodedText;

    try {

      const parsed = JSON.parse(decodedText);

      if (parsed?.id) finalValue = parsed.id;

    } catch {}

    finalValue = finalValue.trim();

    if (lastScannedRef.current === finalValue) return;

    lastScannedRef.current = finalValue;

    setIsProcessing(true);

    try {

      const res = await api.post("/attendance", {
        qrIdentifier: finalValue
      });

      toast.success(res.data.message);

      setLastResult({
        success: true,
        message: res.data.message
      });

      const studentName =
        res.data?.participant?.name || "Unknown";

      const time = new Date(
        res.data.attendanceTime
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      /* prevent duplicate */

      if (!res.data.alreadyMarked) {

        setMarkedStudents(prev => {

          const exists = prev.some(
            s => s.name === studentName
          );

          if (exists) return prev;

          return [

            {
              name: studentName,
              time
            },

            ...prev

          ];

        });

      }

      await stopScanner();

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Attendance failed";

      toast.error(msg);

      setLastResult({
        success: false,
        message: msg
      });

      setIsProcessing(false);

    }

  };

  /* ================= STOP SCANNER ================= */

  const stopScanner = async () => {

    if (scannerRef.current) {

      try {

        await scannerRef.current.stop();
        await scannerRef.current.clear();

      } catch (err) {
        console.log(err);
      }

      scannerRef.current = null;

    }

    setIsActive(false);

  };

  /* ================= RESTART ================= */

  const restartScanner = async () => {

    setLastResult(null);
    setIsProcessing(false);
    lastScannedRef.current = null;

    await stopScanner();
    await startScanner();

  };

  /* ================= UI ================= */

  return (

    <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-2 gap-6">

      {/* Scanner */}

      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold text-center mb-6">
          Scan Event QR Code
        </h2>

        <div
          id={readerId}
          className="w-full min-h-[300px]"
        />

        {lastResult && (

          <div className={`mt-6 text-center font-semibold ${
            lastResult.success
              ? "text-green-600"
              : "text-red-500"
          }`}>
            {lastResult.message}
          </div>

        )}

        {!isActive && (

          <button
            onClick={restartScanner}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
          >
            Scan Next Participant
          </button>

        )}

      </div>

      {/* Attendance List */}

      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">

        <h2 className="text-xl font-bold mb-4">
          Marked Attendance
        </h2>

        {markedStudents.length === 0 && (

          <p className="text-gray-500 text-sm">
            No attendance marked yet
          </p>

        )}

        <div className="space-y-3 max-h-[350px] overflow-y-auto">

          {markedStudents.map((s, i) => (

            <div
              key={i}
              className="flex justify-between p-3 bg-green-50 dark:bg-slate-700 rounded-lg"
            >

              <span className="font-medium">
                {s.name}
              </span>

              <span className="text-sm text-gray-500">
                {s.time}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}