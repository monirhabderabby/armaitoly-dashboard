"use client";

import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { useState } from "react";
import ChangePassword from "./change-password";
import PersonalInformation from "./personal-information";

type Tab = "personal" | "password";

const tabs: { id: Tab; label: string }[] = [
  { id: "personal", label: "Personal Information" },
  { id: "password", label: "Change Password" },
];

interface SettingsContainerProps {
  accessToken: string;
  user: Session["user"];
}

const SettingsContainer = ({ accessToken, user }: SettingsContainerProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-180">
        {/* Page heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-gray-800">Setting</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Dashboard <span className="mx-1">›</span> Setting
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                activeTab === tab.id
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === "personal" && (
          <PersonalInformation accessToken={accessToken} user={user} />
        )}
        {activeTab === "password" && (
          <ChangePassword accessToken={accessToken} />
        )}
      </div>
    </div>
  );
};

export default SettingsContainer;
