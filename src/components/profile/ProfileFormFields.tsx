
import React from 'react';
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileFormFieldsProps {
  fullName: string;
  phoneNumber: string;
  onFullNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  errors: {
    fullName?: string;
    phoneNumber?: string;
  };
  t: any;
}

export const ProfileFormFields = ({
  fullName,
  phoneNumber,
  onFullNameChange,
  onPhoneNumberChange,
  errors,
  t
}: ProfileFormFieldsProps) => {
  return (
    <>
      <div>
        <label 
          htmlFor="fullName" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t.profile.fullName}
        </label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          required
          className="w-full shadow-sm"
          placeholder={t.profile.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription id="fullName-error">
              {errors.fullName}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div>
        <label 
          htmlFor="phoneNumber" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t.profile.phoneNumber}
        </label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          required
          className="w-full shadow-sm"
          placeholder={t.profile.phoneNumber}
          aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
        />
        {errors.phoneNumber && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription id="phoneNumber-error">
              {errors.phoneNumber}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
};
