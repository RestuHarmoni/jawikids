
import { supabase } from "../supabase/client.js";
import { requireAuth, logout } from "./auth.js";
import { showToast } from "./app.js";

const user = await requireAuth();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const emailEl = document.getElementById("userEmail");
if (emailEl) emailEl.textContent = user.email || "Parent";

showToast("📢 HQ JawiKids", "Selamat datang ke dashboard JawiKids.");

async function loadChildren() {
  const { data, error } = await supabase.from("children").select("*").order("created_at", { ascending: false });
  const el = document.getElementById("childrenList");
  if (!el) return;
  if (error) {
    el.innerHTML = `<p>Gagal muat data anak.</p>`;
    return;
  }
  if (!data || !data.length) {
    el.innerHTML = `<div class="notice">Belum ada profil anak. Tambah anak pertama untuk mula belajar.</div>`;
    return;
  }
  el.innerHTML = data.map(c => `<div class="card"><strong>${c.name}</strong><br><span>${c.age || "-"} tahun</span></div>`).join("");
}

document.getElementById("addChildForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("childName").value.trim();
  const age = Number(document.getElementById("childAge").value || 0);
  const { error } = await supabase.from("children").insert({ parent_id: user.id, name, age });
  if (error) {
    alert(error.message);
    return;
  }
  e.target.reset();
  loadChildren();
});

loadChildren();
