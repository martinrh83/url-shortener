import useFetch from "@/hooks/useFetch";
import { storeClicks } from "@/services/apiClicks";
import { getLongUrl } from "@/services/apiUrls";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

export default function RedirectLink() {
  const { id } = useParams();
  const { loading, data, fn } = useFetch(getLongUrl, id);
  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    original_url: data?.original_url,
  });

  console.log(data);
  useEffect(() => {
    fn();
  }, []);
  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [data]);

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }
  return null;
}
