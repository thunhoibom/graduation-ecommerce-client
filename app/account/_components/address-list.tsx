"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash, Check, MapPin } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  getAddressBook,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/services/rest-api/address-book";
import type { AddressBookPojo } from "@/types/person";

export function AddressList() {
  const [addresses, setAddresses] = useState<AddressBookPojo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    firstLine: "",
    municipality: "",
    city: "",
    postalCode: "",
    notes: "",
    defaultShipping: false,
  });

  // Load addresses
  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddressBook();
      setAddresses(data);
    } catch {
      toast.error("Không thể tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const resetForm = () => {
    setFormData({
      label: "",
      firstLine: "",
      municipality: "",
      city: "",
      postalCode: "",
      notes: "",
      defaultShipping: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.firstLine.trim() || !formData.city.trim() || !formData.municipality.trim()) {
      toast.error("Vui lòng điền đầy đủ địa chỉ");
      return;
    }

    const payload: AddressBookPojo = {
      label: formData.label || "Địa chỉ",
      defaultShipping: formData.defaultShipping,
      address: {
        firstLine: formData.firstLine,
        municipality: formData.municipality,
        city: formData.city,
        postalCode: formData.postalCode || undefined,
        notes: formData.notes || undefined,
      },
    };

    try {
      if (editingId) {
        const updated = await updateAddress(editingId, payload);
        setAddresses((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        const created = await addAddress(payload);
        setAddresses((prev) => [...prev, created]);
        toast.success("Thêm địa chỉ thành công");
      }
      resetForm();
    } catch {
      toast.error("Không thể lưu địa chỉ");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Xoá địa chỉ thành công");
    } catch {
      toast.error("Không thể xoá địa chỉ");
    }
  };

  const handleEdit = (addr: AddressBookPojo) => {
    setFormData({
      label: addr.label ?? "",
      firstLine: addr.address?.firstLine ?? "",
      municipality: addr.address?.municipality ?? "",
      city: addr.address?.city ?? "",
      postalCode: addr.address?.postalCode ?? "",
      notes: addr.address?.notes ?? "",
      defaultShipping: addr.defaultShipping ?? false,
    });
    setEditingId(addr.id ?? null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-neutral-500" />
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
            Địa chỉ giao hàng
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="gap-1.5 rounded-none"
        >
          <Plus className="size-3.5" />
          Thêm địa chỉ
        </Button>
      </div>

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <MapPin className="size-10 text-neutral-200 dark:text-neutral-800" />
          <p className="text-sm text-neutral-500">Chưa có địa chỉ nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between rounded-none border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {addr.label ?? "Địa chỉ"}
                  </p>
                  {addr.defaultShipping && (
                    <span className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-500 dark:border-neutral-700">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  {[addr.address?.firstLine, addr.address?.municipality, addr.address?.city]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => handleEdit(addr)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  aria-label="Sửa địa chỉ"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => addr.id && handleDelete(addr.id)}
                  className="p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  aria-label="Xóa địa chỉ"
                >
                  <Trash className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {editingId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Nhãn (tuỳ chọn)</Label>
              <Input
                placeholder="VD: Nhà riêng, Công ty"
                value={formData.label}
                onChange={(e) => setFormData((d) => ({ ...d, label: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label>Địa chỉ *</Label>
              <Input
                placeholder="Số nhà, tên đường"
                value={formData.firstLine}
                onChange={(e) => setFormData((d) => ({ ...d, firstLine: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Quận / Huyện *</Label>
              <Input
                placeholder="Quận 1"
                value={formData.municipality}
                onChange={(e) => setFormData((d) => ({ ...d, municipality: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tỉnh / Thành phố *</Label>
              <Input
                placeholder="TP. Hồ Chí Minh"
                value={formData.city}
                onChange={(e) => setFormData((d) => ({ ...d, city: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Mã bưu điện</Label>
              <Input
                placeholder="700000"
                value={formData.postalCode}
                onChange={(e) => setFormData((d) => ({ ...d, postalCode: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ghi chú</Label>
              <Input
                placeholder="Ghi chú giao hàng"
                value={formData.notes}
                onChange={(e) => setFormData((d) => ({ ...d, notes: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={formData.defaultShipping}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, defaultShipping: e.target.checked }))
                  }
                  className="accent-neutral-900"
                />
                Đặt làm địa chỉ giao hàng mặc định
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} size="sm" className="rounded-none">
              {editingId ? "Cập nhật" : "Thêm địa chỉ"}
            </Button>
            <Button variant="outline" size="sm" onClick={resetForm} className="rounded-none">
              Huỷ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
