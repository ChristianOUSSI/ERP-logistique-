"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Raccourcis clavier globaux d'entreprise pour les utilisateurs experts.
 * - 'g' puis 't' -> Navigation Transport
 * - 'g' puis 'm' -> Navigation Magasin
 * - 'g' puis 'f' -> Navigation Finance
 * - 'g' puis 'a' -> Navigation Admin / Audit
 */
export function KeyboardShortcutHandler() {
  const router = useRouter();

  useEffect(() => {
    let lastKey = "";
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ne pas intercepter si l'utilisateur est dans un champ de saisie
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName
        )
      ) {
        return;
      }

      const now = Date.now();

      if (lastKey === "g" && now - lastKeyTime < 800) {
        if (e.key === "t") {
          e.preventDefault();
          router.push("/transport");
        } else if (e.key === "m") {
          e.preventDefault();
          router.push("/magasin");
        } else if (e.key === "f") {
          e.preventDefault();
          router.push("/finance/overview");
        } else if (e.key === "a") {
          e.preventDefault();
          router.push("/admin/journal");
        }
        lastKey = "";
        return;
      }

      if (e.key === "g") {
        lastKey = "g";
        lastKeyTime = now;
      } else {
        lastKey = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
