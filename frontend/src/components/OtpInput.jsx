import React, { useRef, useState, useEffect } from "react";

export default function OtpInput({ length = 6, value = "", onChange }) {
  const [digits, setDigits] = useState(() =>
    value.split("").slice(0, length)
  );

  const refs = useRef([]);

  // Sync external value → local input boxes
  useEffect(() => {
    const arr = value.split("").slice(0, length);
    setDigits(arr);
  }, [value, length]);

  function updateDigit(index, v) {
    const clean = v.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);

    // Send final OTP string to parent
    onChange && onChange(next.join(""));

    // Auto-focus next digit
    if (clean && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={digits[i] || ""}
          onChange={(e) => updateDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          maxLength={1}
          inputMode="numeric"
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 600,
            borderRadius: 10,
            border: "2px solid #d8c4a3",
            background: "#fff",
            color: "#3b2311",
            outline: "none",
            transition: "0.25s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "#d1a05f")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "#d8c4a3")
          }
        />
      ))}
    </div>
  );
}
