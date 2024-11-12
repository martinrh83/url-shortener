import UAParser from "ua-parser-js";
import { supabase } from "./supabase";

export async function getClicks(urlIds) {
  let { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Clicks");
  }
  return data;
}

const parser = new UAParser();

export async function storeClicks({ id, original_url }) {
  console.log(original_url);
  try {
    const res = parser.getDevice();
    const device = res.type || "desktop";

    const response = await fetch("https://ipapi.co/json");
    const { city, country_name: country } = await response.json();

    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    });

    window.location.href = original_url;
  } catch (error) {
    console.error("error recording click", error);
  }
}

export async function getClicksForUrl(url_id) {
  console.log(id);
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Error loading clicks");
  }

  return data;
}
