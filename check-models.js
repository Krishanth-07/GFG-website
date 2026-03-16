const urls = [
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/desk/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/table/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/chair-wood/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bookcase-wide/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/computer-mouse/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/korok/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/lamp/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/plant/model.gltf",
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/trophy/model.gltf"
];

Promise.all(urls.map(url => fetch(url, {method: 'HEAD'})
  .then(res => ({url, ok: res.ok}))
  .catch(() => ({url, ok: false}))
))
.then(results => {
  results.forEach(r => console.log(r.url, r.ok ? 'OK' : 'FAIL'));
});
