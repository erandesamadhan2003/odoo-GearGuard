import { RequestForm } from "@/components/requests/RequestForm";

export const CreateRequestPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Create Maintenance Request
      </h1>

      <RequestForm />
    </div>
  );
};