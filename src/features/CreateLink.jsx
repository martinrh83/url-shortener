import { useUrl } from "@/contexts/UrlContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorForm from "@/ui/ErrorForm";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { QRCode } from "react-qrcode-logo";
import useFetch from "@/hooks/useFetch";
import { BeatLoader } from "react-spinners";
import { createUrl } from "@/services/apiUrls";

export default function CreateLink() {
  const { user } = useUrl();
  const ref = useRef();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    longUrl: Yup.string()
      .url("Must be a valid url")
      .required("Long URL is required"),
    customUrl: Yup.string(),
  });

  function handleChange(e) {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  }

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);

  async function createNewLink() {
    setErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  }

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && (
          <QRCode value={formValues?.longUrl} size={250} ref={ref} />
        )}

        <Input
          id="title"
          placeholder="Short Link's title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <ErrorForm message={errors.title} />}
        <Input
          id="longUrl"
          placeholder="Enter your long url"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <ErrorForm message={errors.longUrl} />}
        <div className="flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card> /
          <Input
            id="customUrl"
            placeholder="custom link(optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <ErrorForm message={error.message} />}
        <DialogFooter className="sm:justify-start">
          <Button
            disabled={loading}
            variant="destructive"
            onClick={createNewLink}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
