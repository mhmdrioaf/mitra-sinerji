"use client";

import { createBarang, deleteBarang, updateBarang } from "@/lib/api/barang";
import {
  BarangDto,
  FormBarangAction,
  TBarang,
} from "@/lib/api/barang/definitions";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";
import { Button } from "../button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../form";
import { Input } from "../input";
import { useToast } from "../use-toast";
import CurrencyInput from "./CurrencyInput";

interface IFormBarangProps {
  action?: FormBarangAction;
  defaultValues?: TBarang;
  className?: string;
}

const initialFormValues: z.infer<typeof BarangDto> = {
  kode: "",
  nama: "",
  harga: 0,
};

export default function FormBarang({
  action = FormBarangAction.Create,
  defaultValues,
  className,
}: IFormBarangProps) {
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<boolean>(false);

  const page = {
    title:
      action === FormBarangAction.Create
        ? "Tambahkan barang baru"
        : "Edit barang",
    description:
      action === FormBarangAction.Create
        ? "Silakan isi input dibawah ini untuk menambahkan barang baru ke dalam database"
        : "Silakan isi input dibawah ini untuk mengubah data barang yang sudah ada",
  };

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof BarangDto>>({
    defaultValues:
      action === FormBarangAction.Update ? defaultValues : initialFormValues,
  });

  async function submitHandler(data: z.infer<typeof BarangDto>) {
    if (action === FormBarangAction.Create) {
      return await createBarang(data);
    } else {
      const id = defaultValues!.id;
      return await updateBarang(id, data);
    }
  }

  const onSubmit = async (data: z.infer<typeof BarangDto>) => {
    setSubmitting(true);

    const response = await submitHandler(data);

    if (response.status === 201 || response.status === 200) {
      form.reset();
      router.push("/");
      toast({
        title: "Berhasil menyimpan data",
        description: response.message?.at(0),
      });
    } else {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan data",
        description: response.message?.at(0),
      });
    }

    setSubmitting(false);
  };

  const onDelete = async () => {
    setDeleting(true);
    const id = defaultValues!.id;
    const response = await deleteBarang(id);

    if (response.status === 200) {
      setDeleting(false);
      router.replace("/");
      toast({
        title: "Berhasil menghapus data",
        description: response.message?.at(0),
      });
    } else {
      toast({
        variant: "destructive",
        title: "Gagal menghapus data",
        description: response.message?.at(0),
      });
    }

    setDeleting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={twMerge(
          "w-full md:max-w-md mx-auto p-4 rounded-md border border-input flex flex-col gap-2 md:gap-4",
          className
        )}
      >
        <div className="w-full flex flex-col gap-px">
          <b className="text-lg md:text-xl font-bold">{page.title}</b>
          <p className="text-xs text-neutral-600">{page.description}</p>
        </div>

        <FormField
          control={form.control}
          disabled={action === FormBarangAction.Update}
          name="kode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Barang</FormLabel>
              <FormControl>
                <Input placeholder="A001" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Barang</FormLabel>
              <FormControl>
                <Input placeholder="Barang A" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <CurrencyInput
          form={form}
          name="harga"
          label="Harga Barang"
          placeholder="Rp 0"
        />

        <Button type="submit" disabled={submitting || deleting}>
          {submitting && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
          <span>Simpan</span>
        </Button>

        {action === FormBarangAction.Update && (
          <AlertDialog>
            <Button variant="destructive" asChild disabled={deleting}>
              <AlertDialogTrigger>
                {deleting && (
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                )}
                <span>Hapus Barang</span>
              </AlertDialogTrigger>
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah anda yakin akan menghapus barang ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Harap di ingat bahwa barang ini tidak akan dapat dikembalikan
                  setelah di hapus.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <Button variant="destructive" asChild disabled={deleting}>
                  <AlertDialogAction onClick={onDelete}>
                    {deleting && (
                      <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Hapus
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </form>
    </Form>
  );
}
