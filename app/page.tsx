import Link from "next/link";
import { ArrowRight, Package, FileText, Users, Pill, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">PharmaERP</h1>
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Complete Pharmaceutical ERP System
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Manage raw materials, batch manufacturing, QA/QC approvals, inventory tracking, 
            accounting integration, and complete doctor-patient medical workflows - all in one platform.
          </p>
          
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Core Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Package className="h-8 w-8 text-blue-600" />}
            title="Inventory Management"
            description="Track raw materials, process inventory, and finished goods with automatic stock updates and expiry alerts."
          />
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-green-600" />}
            title="Batch Manufacturing"
            description="Manage multiple batches simultaneously with complete traceability from raw materials to finished products."
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-purple-600" />}
            title="QA/QC Approval"
            description="Comprehensive quality control workflow with approval tracking, test results, and rejection management."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-orange-600" />}
            title="Doctor Workflow"
            description="Complete medical records, prescriptions, surgeries, and patient history with medicine traceability."
          />
          <FeatureCard
            icon={<Pill className="h-8 w-8 text-red-600" />}
            title="Accounting Integration"
            description="Automated purchase orders, sales invoices, and real-time financial tracking integrated with inventory."
          />
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-indigo-600" />}
            title="Compliance & Audit"
            description="Complete audit trails, compliance reports, and role-based access control for regulatory requirements."
          />
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-blue-50 py-16 mt-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">End-to-End Workflow</h3>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <WorkflowStep number="1" title="Purchase Raw Materials" description="Create purchase orders and receive materials into raw inventory" />
              <WorkflowStep number="2" title="Issue Materials to Batch" description="Create manufacturing batch and issue raw materials from inventory" />
              <WorkflowStep number="3" title="Process Manufacturing" description="Track work-in-process inventory batch by batch" />
              <WorkflowStep number="4" title="QA/QC Approval" description="Inspect and approve/reject batches before moving to finished goods" />
              <WorkflowStep number="5" title="Move to Finished Goods" description="Approved batches automatically move to finished goods inventory" />
              <WorkflowStep number="6" title="Sales & Distribution" description="Create sales invoices and reduce finished goods stock" />
              <WorkflowStep number="7" title="Medical Tracking" description="Link medicines to prescriptions, surgeries, and patient records" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2026 PharmaERP - Complete Pharmaceutical Management System</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function WorkflowStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h5 className="font-semibold text-lg">{title}</h5>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
