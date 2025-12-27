import { useParams } from "react-router-dom";
import { RequestForm } from "@/components/requests/RequestForm";
export const EditRequestPage = () => {
  const { id } = useParams();

  // later will fetch request by id
  const mockRequest = {
    subject: "Printer issue",
    description: "Paper jam frequently",
    priority: "medium",
    requestType: "corrective",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Edit Request
      </h1>

      <RequestForm initialData={mockRequest} />
    </div>
  );
};
