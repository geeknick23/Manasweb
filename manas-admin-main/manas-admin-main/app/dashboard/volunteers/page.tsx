"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllVolunteers, Volunteer } from "@/lib/api";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllVolunteers()
      .then(setVolunteers)
      .catch((error) => {
        console.error("Error fetching volunteers:", error);
        setVolunteers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="mt-8">
      <CardContent>
        <h1 className="text-2xl font-bold mb-6">Volunteer Submissions</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Why Volunteer?</TableHead>
                <TableHead>Areas of Interest</TableHead>
                <TableHead>Other Area</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Experience/Skills</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => (
                <TableRow key={v._id}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell>{v.phone}</TableCell>
                  <TableCell>{v.city}</TableCell>
                  <TableCell>{v.why}</TableCell>
                  <TableCell>{v.areas.join(", ")}</TableCell>
                  <TableCell>{v.areaOther}</TableCell>
                  <TableCell>{v.availability}</TableCell>
                  <TableCell>{v.experience}</TableCell>
                  <TableCell>{new Date(v.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 