
import { supabase } from "../supabase/client.js";
import { requireAuth, logout } from "./auth.js";
import { showToast } from "./app.js";

const user = await requireAuth();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const emailEl = document.getElementById("userEmail");
if (emailEl) emailEl.textContent = user.email || "Parent";

showToast("📢 HQ JawiKids", "Selamat datang ke dashboard JawiKids.");

async function loadChildren() {
  const { data, error } = await supabase.from("children").select("*").eq("is_active", true).order("created_at", { ascending: false });
  const el = document.getElementById("childrenList");
  const countEl = document.getElementById("childCount");
  if (!el) return;
  if (error) {
    el.innerHTML = `<p>Gagal muat data anak: ${error.message}</p>`;
    return;
  }
  const children = data || [];
  if (countEl) countEl.textContent = children.length;
  if (!children.length) {
    el.innerHTML = `<div class="notice">Belum ada profil anak. Tambah anak pertama untuk mula belajar.</div>`;
    return;
  }
  el.innerHTML = children.map(c => `
    <div class="card">
      <div class="feature-icon">👧</div>
      <h3>${c.name}</h3>
      <p>${c.age || "-"} tahun</p>
      <div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>
      <p>Progress: 0%</p>
    </div>
  `).join("");
}

document.getElementById("addChildForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("childName").value.trim();
  const age = Number(document.getElementById("childAge").value || 0);
  const { data: existing } = await supabase.from("children").select("id").eq("is_active", true);
  if ((existing || []).length >= 5) {
    alert("Maksimum 5 profil anak untuk satu akaun parent.");
    return;
  }
  const { error } = await supabase.from("children").insert({ parent_id: user.id, name, age });
  if (error) {
    alert(error.message);
    return;
  }
  e.target.reset();
  showToast("✅ Profil Anak Ditambah", `${name} berjaya ditambah.`);
  loadChildren();
});

loadChildren();
