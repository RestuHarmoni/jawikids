
import { supabase } from "../supabase/client.js";

export function showToast(title, message) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.innerHTML = `<strong>${title}</strong><br><span>${message}</span>`;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 5000);
}

export async function getPublicSettings() {
  const { data, error } = await supabase.from("settings").select("*").eq("is_public", true);
  if (error) return [];
  return data || [];
}

window.JawiKidsApp = { showToast, getPublicSettings };
