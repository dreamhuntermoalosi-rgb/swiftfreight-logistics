'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  Upload,
  X,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Package,
  Ruler,
  FileText,
  Clock,
  AlertOctagon,
  Droplets,
  Monitor,
  Archive,
  Camera,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import type { Delivery } from '@/lib/types';

// Package categories
const PACKAGE_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Perishables',
  'Documents',
  'Furniture',
  'Building Materials',
  'Medical Supplies',
  'Automotive Parts',
  'Household Goods',
  'Other',
];

// Declaration text
const DECLARATION_TEXT =
  'I hereby declare that the information provided above is true and accurate. I understand that misdeclaration may result in legal consequences under the Laws of Lesotho. I accept that SwiftFreight is a technology platform and is not liable for the contents, condition, or delivery of this parcel. The logistics company handling this shipment bears sole responsibility.';

interface PackageDeclarationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery?: Delivery | null;
}

export function PackageDeclarationForm({
  open,
  onOpenChange,
  delivery,
}: PackageDeclarationFormProps) {
  const { currentUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [packageCategory, setPackageCategory] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isDangerousGoods, setIsDangerousGoods] = useState(false);
  const [isFragile, setIsFragile] = useState(false);
  const [isElectronics, setIsElectronics] = useState(false);
  const [isLiquids, setIsLiquids] = useState(false);
  const [isDocuments, setIsDocuments] = useState(false);
  const [parcelPhotos, setParcelPhotos] = useState<string[]>([]);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [acceptedTimestamp, setAcceptedTimestamp] = useState<string | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    acceptedAt: string;
    trackingNumber?: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Delay reset to allow close animation
      const timer = setTimeout(() => {
        setPackageCategory('');
        setDescription('');
        setEstimatedValue('');
        setWeight('');
        setLength('');
        setWidth('');
        setHeight('');
        setIsDangerousGoods(false);
        setIsFragile(false);
        setIsElectronics(false);
        setIsLiquids(false);
        setIsDocuments(false);
        setParcelPhotos([]);
        setDeclarationAccepted(false);
        setAcceptedTimestamp(null);
        setSubmitted(false);
        setSubmittedData(null);
        setErrors({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle declaration acceptance with timestamp
  const handleDeclarationAccept = (checked: boolean) => {
    setDeclarationAccepted(checked);
    if (checked) {
      const now = new Date();
      const formatted = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setAcceptedTimestamp(formatted);
    } else {
      setAcceptedTimestamp(null);
    }
  };

  // Handle file upload
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const remaining = 4 - parcelPhotos.length;
    const toProcess = Array.from(files).slice(0, remaining);

    toProcess.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', { description: `${file.name} exceeds 5MB limit` });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', { description: `${file.name} is not an image` });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setParcelPhotos((prev) => {
          if (prev.length >= 4) return prev;
          return [...prev, result];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setParcelPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileChange(e.dataTransfer.files);
    },
    [parcelPhotos.length]
  );

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!packageCategory) newErrors.packageCategory = 'Package category is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!estimatedValue || parseFloat(estimatedValue) <= 0)
      newErrors.estimatedValue = 'Estimated value must be greater than 0';
    if (!weight || parseFloat(weight) <= 0) newErrors.weight = 'Weight must be greater than 0';
    if (!length || parseFloat(length) <= 0) newErrors.length = 'Length is required';
    if (!width || parseFloat(width) <= 0) newErrors.width = 'Width is required';
    if (!height || parseFloat(height) <= 0) newErrors.height = 'Height is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    if (!declarationAccepted) {
      toast.error('Please accept the declaration');
      return;
    }

    setSubmitting(true);
    try {
      const dimensions = `${length} × ${width} × ${height} cm`;
      const response = await fetch('/api/declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryId: delivery?.id || 'temp-' + Date.now(),
          packageCategory,
          description,
          estimatedValue: parseFloat(estimatedValue),
          weight: parseFloat(weight),
          dimensions,
          isDangerousGoods,
          isFragile,
          isElectronics,
          isLiquids,
          isDocuments,
          declarationText: DECLARATION_TEXT,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit declaration');
      }

      const data = await response.json();
      setSubmittedData({
        id: data.id || 'PD-' + Date.now(),
        acceptedAt: data.acceptedAt || new Date().toISOString(),
        trackingNumber: delivery?.trackingNumber,
      });
      setSubmitted(true);
      toast.success('Package declaration submitted successfully!');
    } catch (err) {
      toast.error('Submission failed', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Print declaration
  const handlePrint = () => {
    if (!submittedData || !acceptedTimestamp) return;
    const dims = `${length} × ${width} × ${height} cm`;
    const userName = currentUser?.name || 'N/A';
    const userEmail = currentUser?.email || 'N/A';
    const declarationId = submittedData.id;
    const tracking = submittedData.trackingNumber || 'N/A';

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Package Declaration - ${declarationId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #212121; background: #fff; padding: 40px; }
    .container { max-width: 700px; margin: 0 auto; }
    .header { background: #2E7D32; color: white; padding: 28px 32px; border-radius: 10px 10px 0 0; }
    .header h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .header p { font-size: 13px; opacity: 0.85; }
    .body { border: 1px solid #E0E0E0; border-top: none; padding: 28px 32px; border-radius: 0 0 10px 10px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .field { margin-bottom: 4px; }
    .field-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #757575; margin-bottom: 3px; }
    .field-value { font-size: 14px; font-weight: 600; color: #212121; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #2E7D32; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #E8F5E9; }
    .declaration-box { background: #E8F5E9; border: 1px solid #4CAF50; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .declaration-box p { font-size: 12px; line-height: 1.6; color: #212121; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #E0E0E0; display: flex; justify-content: space-between; font-size: 11px; color: #757575; }
    .timestamp { text-align: center; font-size: 12px; color: #2E7D32; font-weight: 600; margin-top: 12px; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
    .badge-green { background: #E8F5E9; color: #2E7D32; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Package Declaration</h1>
      <p>SwiftFreight — Logistics Platform</p>
    </div>
    <div class="body">
      <div class="grid">
        <div class="field"><div class="field-label">Declaration ID</div><div class="field-value">${declarationId}</div></div>
        <div class="field"><div class="field-label">Tracking Number</div><div class="field-value">${tracking}</div></div>
        <div class="field"><div class="field-label">Declared By</div><div class="field-value">${userName}</div></div>
        <div class="field"><div class="field-label">Email</div><div class="field-value">${userEmail}</div></div>
        <div class="field"><div class="field-label">Category</div><div class="field-value">${packageCategory}</div></div>
        <div class="field"><div class="field-label">Estimated Value</div><div class="field-value">M ${estimatedValue}</div></div>
        <div class="field"><div class="field-label">Weight</div><div class="field-value">${weight} kg</div></div>
        <div class="field"><div class="field-label">Dimensions</div><div class="field-value">${dims}</div></div>
      </div>
      <div class="field-label">Description</div>
      <div class="field-value" style="font-weight:400;line-height:1.5;margin-bottom:20px;">${description}</div>
      <div class="grid">
        ${isFragile ? '<div class="field"><span class="badge badge-green"> fragile</span></div>' : ''}
        ${isElectronics ? '<div class="field"><span class="badge badge-green">Electronics</span></div>' : ''}
        ${isLiquids ? '<div class="field"><span class="badge badge-green">Liquids</span></div>' : ''}
        ${isDocuments ? '<div class="field"><span class="badge badge-green">Documents</span></div>' : ''}
      </div>
      <div class="section-title">Declaration</div>
      <div class="declaration-box">
        <p>${DECLARATION_TEXT}</p>
      </div>
      <div class="timestamp">Declared on: ${acceptedTimestamp}</div>
      <div class="footer">
        <span>SwiftFreight Technology Platform</span>
        <span>Generated: ${new Date().toLocaleDateString('en-GB')}</span>
      </div>
    </div>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 overflow-y-auto">
        <SheetHeader
          className="px-6 pt-6 pb-4 sticky top-0 bg-white z-10 border-b"
          style={{ borderColor: '#E0E0E0' }}
        >
          <SheetTitle className="flex items-center gap-2" style={{ color: '#2E7D32' }}>
            <Package className="h-5 w-5" />
            Package Declaration
            {delivery?.trackingNumber && (
              <span
                className="text-xs font-normal px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
              >
                {delivery.trackingNumber}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="px-6 py-5 space-y-6">
            {/* Success State */}
            <AnimatePresence mode="wait">
              {submitted && submittedData ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="rounded-xl p-6 text-center space-y-4"
                    style={{
                      backgroundColor: '#E8F5E9',
                      border: '2px solid #4CAF50',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle2 className="h-16 w-16 mx-auto" style={{ color: '#2E7D32' }} />
                    </motion.div>
                    <div>
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: '#1B5E20' }}
                      >
                        Declaration Submitted
                      </h3>
                      <p className="text-sm" style={{ color: '#757575' }}>
                        Your package declaration has been recorded successfully.
                      </p>
                    </div>

                    {/* Declaration summary */}
                    <div
                      className="rounded-lg p-4 text-left space-y-2 text-sm"
                      style={{ backgroundColor: 'white', border: '1px solid #E0E0E0' }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: '#757575' }}>Declaration ID</span>
                        <span className="font-semibold" style={{ color: '#212121' }}>
                          {submittedData.id}
                        </span>
                      </div>
                      {submittedData.trackingNumber && (
                        <div className="flex justify-between">
                          <span style={{ color: '#757575' }}>Tracking #</span>
                          <span className="font-semibold" style={{ color: '#212121' }}>
                            {submittedData.trackingNumber}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span style={{ color: '#757575' }}>Category</span>
                        <span className="font-semibold" style={{ color: '#212121' }}>
                          {packageCategory}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#757575' }}>Value</span>
                        <span className="font-semibold" style={{ color: '#212121' }}>
                          M {estimatedValue}
                        </span>
                      </div>
                      <Separator />
                      <div
                        className="text-center font-semibold text-xs uppercase tracking-wider"
                        style={{ color: '#2E7D32' }}
                      >
                        Declared on: {acceptedTimestamp}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center pt-2">
                      <Button
                        onClick={handlePrint}
                        style={{ backgroundColor: '#2E7D32', color: 'white' }}
                        className="hover:brightness-110"
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Print Declaration
                      </Button>
                      <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Warning Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg p-3 flex items-start gap-3"
                    style={{
                      backgroundColor: '#FFF3E0',
                      border: '1px solid #FFB74D',
                    }}
                  >
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#E65100' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#E65100' }}>
                        Accurate declaration protects you
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#757575' }}>
                        Please ensure all information is correct. Misdeclaration may result in legal
                        consequences.
                      </p>
                    </div>
                  </motion.div>

                  {/* Package Category */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: '#212121' }}>
                      Package Category <span style={{ color: '#FF5252' }}>*</span>
                    </Label>
                    <Select value={packageCategory} onValueChange={setPackageCategory}>
                      <SelectTrigger
                        className={`w-full ${errors.packageCategory ? 'border-red-400' : ''}`}
                        style={{ borderColor: errors.packageCategory ? '#FF5252' : undefined }}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PACKAGE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.packageCategory && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs"
                        style={{ color: '#FF5252' }}
                      >
                        {errors.packageCategory}
                      </motion.p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: '#212121' }}>
                      Description <span style={{ color: '#FF5252' }}>*</span>
                    </Label>
                    <Textarea
                      placeholder="Describe the contents of the package in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className={`resize-none ${errors.description ? 'border-red-400' : ''}`}
                      style={{ borderColor: errors.description ? '#FF5252' : undefined }}
                    />
                    {errors.description && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs"
                        style={{ color: '#FF5252' }}
                      >
                        {errors.description}
                      </motion.p>
                    )}
                  </div>

                  {/* Estimated Value & Weight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: '#212121' }}>
                        Estimated Value <span style={{ color: '#FF5252' }}>*</span>
                      </Label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold"
                          style={{ color: '#2E7D32' }}
                        >
                          M
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={estimatedValue}
                          onChange={(e) => setEstimatedValue(e.target.value)}
                          className={`pl-9 ${errors.estimatedValue ? 'border-red-400' : ''}`}
                          style={{ borderColor: errors.estimatedValue ? '#FF5252' : undefined }}
                        />
                      </div>
                      {errors.estimatedValue && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs"
                          style={{ color: '#FF5252' }}
                        >
                          {errors.estimatedValue}
                        </motion.p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: '#212121' }}>
                        Weight <span style={{ color: '#FF5252' }}>*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0.0"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className={`pr-9 ${errors.weight ? 'border-red-400' : ''}`}
                          style={{ borderColor: errors.weight ? '#FF5252' : undefined }}
                        />
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                          style={{ color: '#757575' }}
                        >
                          kg
                        </span>
                      </div>
                      {errors.weight && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs"
                          style={{ color: '#FF5252' }}
                        >
                          {errors.weight}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5" style={{ color: '#212121' }}>
                      <Ruler className="h-3.5 w-3.5" />
                      Dimensions (cm) <span style={{ color: '#FF5252' }}>*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Length"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          className={`pr-10 ${errors.length ? 'border-red-400' : ''}`}
                          style={{ borderColor: errors.length ? '#FF5252' : undefined }}
                        />
                        <span
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium"
                          style={{ color: '#757575' }}
                        >
                          L
                        </span>
                      </div>
                      <div className="flex items-center justify-center text-sm font-medium" style={{ color: '#E0E0E0' }}>
                        ×
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Width"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          className={`pr-10 ${errors.width ? 'border-red-400' : ''}`}
                          style={{ borderColor: errors.width ? '#FF5252' : undefined }}
                        />
                        <span
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium"
                          style={{ color: '#757575' }}
                        >
                          W
                        </span>
                      </div>
                      <div className="flex items-center justify-center text-sm font-medium" style={{ color: '#E0E0E0' }}>
                        ×
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className={`pr-10 ${errors.height ? 'border-red-400' : ''}`}
                          style={{ borderColor: errors.height ? '#FF5252' : undefined }}
                        />
                        <span
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium"
                          style={{ color: '#757575' }}
                        >
                          H
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded"
                          style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                        >
                          cm
                        </span>
                      </div>
                    </div>
                    {(errors.length || errors.width || errors.height) && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs"
                        style={{ color: '#FF5252' }}
                      >
                        All dimension fields are required
                      </motion.p>
                    )}
                  </div>

                  <Separator style={{ backgroundColor: '#E0E0E0' }} />

                  {/* Package Content Checkboxes */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold" style={{ color: '#212121' }}>
                      Package Contents
                    </h4>

                    {/* Dangerous Goods - Red border area */}
                    <motion.div
                      initial={false}
                      animate={{
                        borderColor: isDangerousGoods ? '#FF5252' : '#FFCDD2',
                        backgroundColor: isDangerousGoods ? '#FFEBEE' : '#FFF8F8',
                      }}
                      className="rounded-lg p-4 transition-colors"
                      style={{ border: '1.5px solid #FFCDD2' }}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="dangerous-goods"
                          checked={isDangerousGoods}
                          onCheckedChange={(checked) => setIsDangerousGoods(checked === true)}
                          className="mt-0.5"
                          style={
                            {
                              '--primary': '#FF5252',
                            } as React.CSSProperties
                          }
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor="dangerous-goods"
                            className="text-sm font-medium cursor-pointer flex items-start gap-2"
                            style={{ color: '#D32F2F' }}
                          >
                            <AlertOctagon className="h-4 w-4 shrink-0 mt-0.5" />
                            I confirm this package does NOT contain dangerous goods, hazardous
                            materials, explosives, flammable items, or any substance prohibited by
                            Lesotho law
                          </Label>
                          <p className="text-xs" style={{ color: '#E57373' }}>
                            Checking this box confirms the package is safe for transport.
                          </p>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isDangerousGoods && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 ml-7"
                          >
                            <div
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs"
                              style={{ backgroundColor: '#FFCDD2', color: '#C62828' }}
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Declaration confirms: No dangerous goods
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Other checkboxes in a 2-col grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Fragile */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isFragile ? '#FFF3E0' : '#FAFAFA',
                          border: `1px solid ${isFragile ? '#FFB74D' : '#E0E0E0'}`,
                        }}
                        onClick={() => setIsFragile(!isFragile)}
                      >
                        <Checkbox
                          id="fragile"
                          checked={isFragile}
                          onCheckedChange={(checked) => setIsFragile(checked === true)}
                          className="mt-0.5"
                        />
                        <div>
                          <Label
                            htmlFor="fragile"
                            className="text-sm cursor-pointer flex items-center gap-1.5"
                            style={{ color: '#212121' }}
                          >
                            <Archive className="h-3.5 w-3.5" style={{ color: '#E65100' }} />
                            Fragile Items
                          </Label>
                          <p className="text-xs mt-0.5" style={{ color: '#757575' }}>
                            Requires careful handling
                          </p>
                        </div>
                      </motion.div>

                      {/* Electronics */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isElectronics ? '#E3F2FD' : '#FAFAFA',
                          border: `1px solid ${isElectronics ? '#90CAF9' : '#E0E0E0'}`,
                        }}
                        onClick={() => setIsElectronics(!isElectronics)}
                      >
                        <Checkbox
                          id="electronics"
                          checked={isElectronics}
                          onCheckedChange={(checked) => setIsElectronics(checked === true)}
                          className="mt-0.5"
                        />
                        <div>
                          <Label
                            htmlFor="electronics"
                            className="text-sm cursor-pointer flex items-center gap-1.5"
                            style={{ color: '#212121' }}
                          >
                            <Monitor className="h-3.5 w-3.5" style={{ color: '#1565C0' }} />
                            Electronic Devices
                          </Label>
                          <p className="text-xs mt-0.5" style={{ color: '#757575' }}>
                            Contains electronic items
                          </p>
                        </div>
                      </motion.div>

                      {/* Liquids */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isLiquids ? '#E0F7FA' : '#FAFAFA',
                          border: `1px solid ${isLiquids ? '#80DEEA' : '#E0E0E0'}`,
                        }}
                        onClick={() => setIsLiquids(!isLiquids)}
                      >
                        <Checkbox
                          id="liquids"
                          checked={isLiquids}
                          onCheckedChange={(checked) => setIsLiquids(checked === true)}
                          className="mt-0.5"
                        />
                        <div>
                          <Label
                            htmlFor="liquids"
                            className="text-sm cursor-pointer flex items-center gap-1.5"
                            style={{ color: '#212121' }}
                          >
                            <Droplets className="h-3.5 w-3.5" style={{ color: '#00838F' }} />
                            Liquid Items
                          </Label>
                          <p className="text-xs mt-0.5" style={{ color: '#757575' }}>
                            Contains liquid substances
                          </p>
                        </div>
                      </motion.div>

                      {/* Documents */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isDocuments ? '#F3E5F5' : '#FAFAFA',
                          border: `1px solid ${isDocuments ? '#CE93D8' : '#E0E0E0'}`,
                        }}
                        onClick={() => setIsDocuments(!isDocuments)}
                      >
                        <Checkbox
                          id="documents"
                          checked={isDocuments}
                          onCheckedChange={(checked) => setIsDocuments(checked === true)}
                          className="mt-0.5"
                        />
                        <div>
                          <Label
                            htmlFor="documents"
                            className="text-sm cursor-pointer flex items-center gap-1.5"
                            style={{ color: '#212121' }}
                          >
                            <FileText className="h-3.5 w-3.5" style={{ color: '#7B1FA2' }} />
                            Important Documents
                          </Label>
                          <p className="text-xs mt-0.5" style={{ color: '#757575' }}>
                            Contains important papers
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <Separator style={{ backgroundColor: '#E0E0E0' }} />

                  {/* Parcel Photos Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5" style={{ color: '#212121' }}>
                      <Camera className="h-3.5 w-3.5" />
                      Parcel Photos
                      <span className="text-xs font-normal" style={{ color: '#757575' }}>
                        (up to 4, max 5MB each)
                      </span>
                    </Label>

                    {/* Photo thumbnails */}
                    {parcelPhotos.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-2">
                        {parcelPhotos.map((photo, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group rounded-lg overflow-hidden"
                            style={{
                              width: '72px',
                              height: '72px',
                              border: '1px solid #E0E0E0',
                            }}
                          >
                            <img
                              src={photo}
                              alt={`Parcel photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Drop zone */}
                    {parcelPhotos.length < 4 && (
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                        style={{
                          backgroundColor: isDragging ? '#E8F5E9' : '#FAFAFA',
                          border: `2px dashed ${isDragging ? '#4CAF50' : '#E0E0E0'}`,
                        }}
                      >
                        <Upload
                          className="h-8 w-8"
                          style={{ color: isDragging ? '#4CAF50' : '#BDBDBD' }}
                        />
                        <p className="text-sm font-medium" style={{ color: '#757575' }}>
                          {isDragging ? 'Drop photos here' : 'Drag & drop photos or click to upload'}
                        </p>
                        <p className="text-xs" style={{ color: '#BDBDBD' }}>
                          PNG, JPG, WEBP up to 5MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileChange(e.target.files)}
                        />
                      </motion.div>
                    )}
                  </div>

                  <Separator style={{ backgroundColor: '#E0E0E0' }} />

                  {/* Declaration Acceptance */}
                  <div className="space-y-3">
                    <div
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: declarationAccepted ? '#E8F5E9' : '#FAFAFA',
                        border: `1.5px solid ${declarationAccepted ? '#4CAF50' : '#E0E0E0'}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="declaration-accept"
                          checked={declarationAccepted}
                          onCheckedChange={(checked) => handleDeclarationAccept(checked === true)}
                          className="mt-0.5"
                        />
                        <div className="space-y-2">
                          <Label
                            htmlFor="declaration-accept"
                            className="text-sm font-medium cursor-pointer flex items-start gap-2"
                            style={{ color: '#212121' }}
                          >
                            <ShieldCheck
                              className="h-4 w-4 shrink-0 mt-0.5"
                              style={{
                                color: declarationAccepted ? '#2E7D32' : '#BDBDBD',
                              }}
                            />
                            {DECLARATION_TEXT}
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp display */}
                    <AnimatePresence>
                      {acceptedTimestamp && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="flex items-center gap-2 rounded-lg px-4 py-2.5"
                          style={{
                            backgroundColor: '#E8F5E9',
                            border: '1px solid #C8E6C9',
                          }}
                        >
                          <Clock className="h-4 w-4" style={{ color: '#2E7D32' }} />
                          <span className="text-xs font-semibold" style={{ color: '#2E7D32' }}>
                            Declared on: {acceptedTimestamp}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-2 pb-8">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="flex-1"
                      style={{ borderColor: '#E0E0E0', color: '#757575' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || !declarationAccepted}
                      className="flex-1 text-white"
                      style={{
                        backgroundColor:
                          submitting || !declarationAccepted ? '#BDBDBD' : '#2E7D32',
                        cursor:
                          submitting || !declarationAccepted ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="mr-2"
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Submit Declaration
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}