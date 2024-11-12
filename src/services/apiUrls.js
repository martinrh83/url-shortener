import { supabase, supabaseUrl } from "./supabase";

export async function getUrls(userId) {
  let { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }
  return data;
}

export async function deleteUrl(url_id) {
  const { data, error } = await supabase.from("urls").delete().eq("id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unabled to delete url");
  }

  return data;
}

export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode
) {
  const short_url = Math.random().toString(36).substring(2, 6);
  const filename = `qr-${short_url}`;
  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(filename, qrcode);

  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${filename}`;
  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        original_url: longUrl,
        custom_url: customUrl,
        user_id,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error while creating url");
  }

  return data;
}

export async function getLongUrl(id) {
  console.log(id);
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .eq("short_url", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error fetching short link");
  }

  return data;
}
export async function getUrl({ id, user_id }) {
  console.log(id);
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error fetching url");
  }

  return data;
}
