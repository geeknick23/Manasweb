"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from '@/services/api';

const AREAS = [
  "Awareness Campaigns",
  "Social Media & Content Creation",
  "Event Organization",
  "Operations",
  "Fundraising",
];

type VolunteerForm = {
  name: string;
  email: string;
  phone: string;
  city: string;
  why: string;
  areas: string[];
  areaOther: string;
  availability: string;
  experience: string;
};

export default function VolunteerFormPage() {
  const [form, setForm] = useState<VolunteerForm>({
    name: "",
    email: "",
    phone: "",
    city: "",
    why: "",
    areas: [],
    areaOther: "",
    availability: "",
    experience: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        areas: target.checked
          ? [...prev.areas, value]
          : prev.areas.filter((a) => a !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    
    // Validate required fields
    if (!form.name || !form.email || !form.phone || !form.city || !form.why || !form.availability) {
      setError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }
    
    // Ensure areas is always an array
    const submitData = {
      ...form,
      areas: form.areas || []
    };
    
    try {
      await api.submitVolunteerForm(submitData);
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        why: "",
        areas: [],
        areaOther: "",
        availability: "",
        experience: "",
      });
    } catch (err: unknown) {
      console.error('Volunteer submission error:', err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hope-light flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-card-hover p-8 w-full max-w-xl border border-slate-100">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 text-center">Volunteer With Us</h1>
        <p className="text-slate-600 mb-8 text-center">Fill out the form below to join our mission!</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required suppressHydrationWarning={true} className="mt-1 w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 bg-slate-50 shadow-sm text-slate-800 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required suppressHydrationWarning={true} className="mt-1 w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 bg-slate-50 shadow-sm text-slate-800 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required suppressHydrationWarning={true} className="mt-1 w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 bg-slate-50 shadow-sm text-slate-800 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">City/Location</label>
            <input name="city" value={form.city} onChange={handleChange} required suppressHydrationWarning={true} className="mt-1 w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 bg-slate-50 shadow-sm text-slate-800 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Why do you want to volunteer with Manas?</label>
            <textarea name="why" value={form.why} onChange={handleChange} required rows={3} suppressHydrationWarning={true} className="mt-1 w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 bg-slate-50 shadow-sm text-slate-800 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Areas of Interest (select all that apply):</label>
            <div className="flex flex-wrap gap-4 mb-2 text-slate-700">
              {AREAS.map((area) => (
                <label key={area} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="areas"
                    value={area}
                    checked={form.areas.includes(area)}
                    onChange={handleChange}
                    suppressHydrationWarning={true}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  {area}
                </label>
              ))}
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-slate-700">Other:</label>
              <input name="areaOther" value={form.areaOther} onChange={handleChange} suppressHydrationWarning={true} className="mt-1 w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 bg-slate-50 shadow-sm text-slate-800 px-4 py-3" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Availability:</label>
            <div className="flex gap-6">
              {['Weekdays', 'Weekends', 'Flexible'].map((option) => (
                <label key={option} className="flex items-center text-slate-700 gap-2">
                  <input
                    type="radio"
                    name="availability"
                    value={option}
                    checked={form.availability === option}
                    onChange={handleChange}
                    suppressHydrationWarning={true}
                    className="border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Any relevant experience or skills?</label>
            <textarea name="experience" value={form.experience} onChange={handleChange} rows={3} suppressHydrationWarning={true} className="mt-1 w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 bg-slate-50 shadow-sm text-slate-800 px-4 py-3" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-primary-600 text-sm">Thank you for volunteering! We will contact you soon.</div>}
          <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 cursor-pointer" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
