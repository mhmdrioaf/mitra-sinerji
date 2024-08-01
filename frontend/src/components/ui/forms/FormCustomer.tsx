"use client";

import { createCustomer, updateCustomer } from "@/lib/api/customer/actions";
import {
  CustomerDto,
  FormCustomerAction,
  TCustomer,
} from "@/lib/api/customer/definitions";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { Button } from "../button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../form";
import { Input } from "../input";
import { useToast } from "../use-toast";
import DeleteCustomer from "./DeleteCustomer";

interface IFormCustomerProps {
  action?: FormCustomerAction;
  defaultValues?: TCustomer;
  className?: string;
}

const initialFormValues: z.infer<typeof CustomerDto> = {
  kode: "",
  name: "",
  telp: "",
};

export default function FormCustomer({
  action = FormCustomerAction.Create,
  defaultValues,
  className,
}: IFormCustomerProps) {
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const page = {
    title:
      action === FormCustomerAction.Create
        ? "Tambahkan customer baru"
        : "Edit customer",
    description:
      action === FormCustomerAction.Create
        ? "Silakan isi input dibawah ini untuk menambahkan customer baru ke dalam database"
        : "Silakan isi input dibawah ini untuk mengubah data customer yang sudah ada",
  };

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof CustomerDto>>({
    defaultValues:
      action === FormCustomerAction.Update ? defaultValues : initialFormValues,
  });

  async function submitHandler(data: z.infer<typeof CustomerDto>) {
    if (action === FormCustomerAction.Create) {
      return await createCustomer(data);
    } else {
      const id = defaultValues!.id;
      return await updateCustomer(id, data);
    }
  }

  const onSubmit = async (data: z.infer<typeof CustomerDto>) => {
    setSubmitting(true);

    const response = await submitHandler(data);

    if (response.status === 201 || response.status === 200) {
      form.reset();
      router.back();
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
          disabled={action === FormCustomerAction.Update}
          name="kode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Customer</FormLabel>
              <FormControl>
                <Input placeholder="C001" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Customer</FormLabel>
              <FormControl>
                <Input placeholder="Customer A" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon Customer</FormLabel>
              <FormControl>
                <Input placeholder="62xxxx" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
          <span>Simpan</span>
        </Button>

        {action === FormCustomerAction.Update && (
          <DeleteCustomer id={defaultValues!.id} />
        )}
      </form>
    </Form>
  );
}
