"use client";

import { deleteBarang } from "@/lib/api/barang";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
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
import { useToast } from "../use-toast";

interface IDeleteBarangProps {
  id: number;
  redirect?: boolean;
  callback?: () => void;
}

export default function DeleteBarang({
  id,
  redirect = true,
  callback,
}: IDeleteBarangProps) {
  const [deleting, setDeleting] = React.useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();

  const onDelete = async () => {
    setDeleting(true);
    const response = await deleteBarang(id);

    if (response.status === 200) {
      setDeleting(false);
      if (redirect) {
        router.back();
      } else {
        if (callback) {
          callback();
        }
        router.refresh();
      }
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
    <AlertDialog>
      <Button variant="destructive" asChild disabled={deleting}>
        <AlertDialogTrigger>
          {deleting && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
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
  );
}
