import React from 'react'
import { useState, useEffect, useRef, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/auth.css';

export default function OtpInput({ onChange, clearRef }) {
  const inputs = useRef([]);

  useEffect(() => {
    if (clearRef) {
      clearRef.current = () => {
        inputs.current.forEach((el) => { if (el) el.value = ""; });
        inputs.current[0]?.focus();
        onChange?.("");
      };
    }
  }, [clearRef, onChange]);

  function handleInput(e, idx) {
    const val = e.target.value.replace(/\D/g, "");
    e.target.value = val ? val[0] : "";
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    collect();
  }

  function handleKeyDown(e, idx) {
    if (e.key === "Backspace" && !e.target.value && idx > 0)
      inputs.current[idx - 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    digits.split("").forEach((d, i) => {
      if (inputs.current[i]) inputs.current[i].value = d;
    });
    inputs.current[Math.min(digits.length, 5)]?.focus();
    collect();
  }

  function collect() {
    onChange?.(inputs.current.map((el) => el?.value || "").join(""));
  }

  return (
    <div className="otp-group" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input key={i} type="text" maxLength={1} inputMode="numeric"
          ref={(el) => (inputs.current[i] = el)}
          onInput={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}
