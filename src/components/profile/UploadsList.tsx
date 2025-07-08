import React from "react";

interface Upload {
  id: string;
  filetype: string;
  name: string;
  url: string;
  _count: {
    applications: number;
    jobOpenings: number;
  };
}

interface UploadsListProps {
  uploads: Upload[];
}

export default function UploadsList({ uploads }: UploadsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      {uploads.length === 0 ? (
        <p className="text-gray-500">No uploads yet.</p>
      ) : (
        <div className="space-y-3">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-800">{upload.name}</h3>
                <p className="text-sm text-gray-600">Type: {upload.filetype}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Used in {upload._count.applications} applications
                </p>
                <a
                  href={upload.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
