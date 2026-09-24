import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <Badge>UniCore</Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              University Management System
            </h1>

            <p className="mt-3 max-w-2xl text-muted-foreground">
              A modern academic administration platform for students,
              instructors, and administrators.
            </p>
          </div>

          <ThemeToggle />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                Manage university students.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">12,480</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>
                Manage academic courses.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">342</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructors</CardTitle>
              <CardDescription>
                Manage teaching staff.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">286</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button>Get Started</Button>
          <Button variant="outline">View Dashboard</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </div>
    </main>
  );
}