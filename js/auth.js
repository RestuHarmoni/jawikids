
import { supabase } from "../supabase/client.js";

const $ = (id) => document.getElementById(id);

export async function registerParent({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  if (error) throw error;
  return data;
}

export async function loginParent({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

export async function requireAuth() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) window.location.href = "login.html";
  return data.user;
}

window.JawiKidsAuth = { registerParent, loginParent, logout, requireAuth };
