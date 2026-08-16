"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { FieldErrors } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { updateProfileSchema, type UpdateProfileInput } from "~/schema/profile.schema";
import { api } from "~/trpc/react";

type EditProfileFormProps = {
  initialProfile: {
    id: string;
    userId: string;
    name: string;
    bio: string | null;
    avatar: string | null;
    banner: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  };
};

type InputInStyleProps = {
  register: any,
  errors: any,
  label: string,
  name: keyof UpdateProfileInput,
  isrequired?: boolean,
  placeholder?: string,
  type?: string,
}

const InputInStyle = ({ register, errors, label, name, isrequired, placeholder, type }: InputInStyleProps) => {
  const InputComp = type === "textarea" ? Textarea : Input;
  return <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label} {isrequired && <span className="text-destructive">*</span>}
    </Label>
    <InputComp
      {...register(name)}
      placeholder={placeholder}
      className="h-9 rounded-2xl"
      aria-invalid={!!errors.name}
    />
    {errors.name && (<p className="text-xs font-normal text-destructive">{errors.name.message}</p>)}
  </div>
}

export default function EditProfileForm({ initialProfile }: EditProfileFormProps) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema) as any,
    shouldUnregister: true,
    defaultValues: {
      name: initialProfile.name,
      bio: initialProfile.bio ?? "",
      avatar: initialProfile.avatar ?? "",
      banner: initialProfile.banner ?? "",
    },
  });

  const mutation = api.profile.update.useMutation({
    onSuccess: () => { toast.success("Profile updated successfully!"); router.push("/profile"); },
    onError: (err) => toast.error(err.message || "Failed to update profile"),
  });

  const onSubmit = (data: UpdateProfileInput) => mutation.mutate(data);

  const onInvalid = (errors: FieldErrors<UpdateProfileInput>) => {
    const errorMsg = Object.keys(errors).map((key) => {
      const error = errors[key as keyof UpdateProfileInput];
      if (!error) return null;
      return `${key}: ${error.message || "Invalid value"}`;
    }).filter((msg): msg is string => msg !== null).join(", ");
    toast.error(`Please correct form errors: ${errorMsg}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update your profile information and preferences.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <InputInStyle register={register} errors={errors} label="Display Name" name="name" isrequired placeholder="Enter your display name" />
            <InputInStyle register={register} errors={errors} label="Bio" name="bio" type="textarea" placeholder="Tell us a little about yourself..." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <InputInStyle register={register} errors={errors} label="Avatar URL" name="avatar" placeholder="https://example.com/avatar.jpg" />
            <InputInStyle register={register} errors={errors} label="Banner URL" name="banner" placeholder="https://example.com/banner.jpg" />
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" className="rounded-2xl" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || mutation.isPending} className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/80 flex items-center gap-2">
            {(isSubmitting || mutation.isPending) && <Spinner className="text-current" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
