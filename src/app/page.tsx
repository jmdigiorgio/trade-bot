import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="mb-8 text-4xl font-bold">Custom Components Demo</h1>
      
      <div className="grid gap-8">
        {/* Button Examples */}
        <Card title="Button Variants">
          <div className="flex flex-wrap gap-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>
        </Card>

        {/* Button Sizes */}
        <Card title="Button Sizes">
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Card>

        {/* Card Example */}
        <Card title="Nested Card Example">
          <p className="mb-4 text-gray-600">
            This is a card component that can contain any content, including other components.
          </p>
          <Button variant="secondary">Action Button</Button>
        </Card>
      </div>
    </main>
  );
}
