"use client";

import { useEffect, useState } from "react";

interface Props {
  date: string;
}

export default function LocalDate({ date }: Props) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    setFormatted(
      new Date(date).toLocaleString("fi-FI", {
        dateStyle: "short",
        timeStyle: "medium",
      }),
    );
  }, [date]);

  return <>{formatted}</>;
}