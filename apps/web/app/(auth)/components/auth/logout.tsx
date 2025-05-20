"use client"

import { AlertDialog,AlertDialogCancel,AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function LogoutDialog() {
    const { logout } = useAuth();
    return(
      <AlertDialog>
        <AlertDialogTrigger className="w-full cursor-pointer">
          Logout
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to logout?</AlertDialogDescription>
          </AlertDialogHeader>
         
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={()=>logout()}>Logout</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    )
  }