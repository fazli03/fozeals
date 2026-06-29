import { supabase } from './lib/supabase';

// Helper untuk URL gambar — kalau bukan http langsung, anggap sudah full URL
export function asset(path) {
  if (!path) return '';
  return path;
}

// Mapping: kolom snake_case Supabase → camelCase yang dipakai komponen React
function toProject(row) {
  return {
    id:               row.slug,
    dbId:             row.id,
    name:             row.name,
    category:         row.category,
    year:             row.year,
    role:             row.role,
    timeline:         row.timeline,
    tools:            row.tools ?? [],
    problemStatement: row.problem_statement,
    psLabel:          row.ps_label ?? 'Problem Statement',
    solutions:        row.solutions,
    prototypeUrl:     row.prototype_url,
    codeUrl:          row.code_url,
    heroImage:        row.hero_image,
    pageImages:       row.page_images ?? [],
    sortOrder:        row.sort_order,
  };
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data.map(toProject);
}

export async function getProject(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw new Error(error.message);
  return toProject(data);
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function saveProject(payload) {
  const isEdit = !!payload.dbId;
  const row = {
    slug:              payload.id || toSlug(payload.name),
    name:              payload.name,
    category:          payload.category || null,
    year:              payload.year || null,
    role:              payload.role || null,
    timeline:          payload.timeline || null,
    tools:             payload.tools ?? [],
    problem_statement: payload.problemStatement || null,
    solutions:         payload.solutions || null,
    prototype_url:     payload.prototypeUrl || null,
    code_url:          payload.codeUrl || null,
    hero_image:        payload.heroImage || null,
    page_images:       payload.pageImages ?? [],
    sort_order:        payload.sortOrder ?? 0,
    updated_at:        new Date().toISOString(),
  };

  if (isEdit) {
    const { error } = await supabase.from('projects').update(row).eq('id', payload.dbId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('projects').insert(row);
    if (error) throw new Error(error.message);
  }
}

export async function deleteProject(dbId) {
  const { error } = await supabase.from('projects').delete().eq('id', dbId);
  if (error) throw new Error(error.message);
}
