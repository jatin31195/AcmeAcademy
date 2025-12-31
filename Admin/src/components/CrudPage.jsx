import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import PageHeader from "@/components/PageHeader";
import EnhancedDataTable from "@/components/EnhancedDataTable";
import SearchFilterBar from "@/components/SearchFilterBar";
import Modal, { ConfirmDialog } from "@/components/Modal";
import FormInput from "@/components/FormInput";
import StatusToggle from "@/components/StatusToggle";
import { PageLoader } from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/useCrud";
import { usePagination } from "@/hooks/usePagination";

/* ---------------------------------- */
/* CrudPage */
/* ---------------------------------- */

const CrudPage = ({
  title,
  description,
  service,
  columns,
  formFields,
  searchPlaceholder = "Search...",
  entityName = "Item",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null);

  const pagination = usePagination({ initialLimit: 10 });

  const crud = useCrud({
    service,
    entityName,
  });

  /* ---------------------------------- */
  /* Fetch data */
  /* ---------------------------------- */
  useEffect(() => {
    crud.fetchItems({
      page: pagination.page,
      limit: pagination.limit,
      search: searchValue,
    });
  }, [
    pagination.page,
    pagination.limit,
    searchValue,
    crud.refreshTrigger,
  ]);

  useEffect(() => {
    if (crud.total !== pagination.total) {
      pagination.setTotal(crud.total);
    }
  }, [crud.total]);

  /* ---------------------------------- */
  /* Modal state sync */
  /* ---------------------------------- */
  useEffect(() => {
    if (crud.selectedItem && crud.modalMode === "edit") {
      setFormData(crud.selectedItem);
    } else if (crud.modalMode === "create") {
      setFormData({});
    }
  }, [crud.selectedItem, crud.modalMode, crud.isModalOpen]);

  /* ---------------------------------- */
  /* Handlers */
  /* ---------------------------------- */
  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
  const payload = {
    ...formData,
    file: imageFile, // 🔥 THIS WAS MISSING
  };

  if (crud.modalMode === "create") {
    await crud.createItem(payload);
  } else if (crud.modalMode === "edit" && crud.selectedItem) {
    await crud.updateItem(crud.selectedItem.id, payload);
  }

  setFormData({});
  setImageFile(null);
};


  const handleDelete = async () => {
    if (crud.selectedItem) {
      await crud.deleteItem(crud.selectedItem);
    }
  };

  /* ---------------------------------- */
  /* Error state */
  /* ---------------------------------- */
  if (crud.error && crud.items.length === 0) {
    return (
      <div className="animate-fade-in">
        <PageHeader title={title} description={description} />
        <ErrorDisplay
          variant="page"
          message={crud.error}
          onRetry={() => crud.fetchItems()}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <PageHeader title={title} description={description}>
        <Button
          className="gradient-primary"
          onClick={crud.openCreateModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {entityName}
        </Button>
      </PageHeader>

      {/* Search */}
      <div className="mb-6">
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder={searchPlaceholder}
        />
      </div>

      {/* Table */}
      {crud.loading && crud.items.length === 0 ? (
        <PageLoader />
      ) : (
        <EnhancedDataTable
          columns={columns}
          data={crud.items}
          loading={crud.loading}
          pagination={pagination.paginationProps}
          onEdit={crud.openEditModal}
          onDelete={crud.openDeleteDialog}
          onView={crud.openViewModal}
          emptyMessage={`No ${title.toLowerCase()} found`}
        />
      )}

      {/* ---------------------------------- */}
      {/* Create / Edit / View Modal */}
      {/* ---------------------------------- */}
      <Modal
        open={crud.isModalOpen}
        onClose={crud.closeModal}
        title={
          crud.modalMode === "create"
            ? `Add ${entityName}`
            : crud.modalMode === "edit"
            ? `Edit ${entityName}`
            : `View ${entityName}`
        }
        size="lg"
        footer={
          crud.modalMode !== "view" && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={crud.closeModal}>
                Cancel
              </Button>
              <Button
                className="gradient-primary"
                onClick={handleSubmit}
                disabled={crud.loading}
              >
                {crud.modalMode === "create"
                  ? "Create"
                  : "Save Changes"}
              </Button>
            </div>
          )
        }
      >
        <div className="grid gap-4">
          {formFields.map((field) => {
            /* ---------- TOGGLE ---------- */
            if (field.type === "toggle") {
              return (
                <StatusToggle
                  key={field.name}
                  label={field.label}
                  checked={Boolean(formData[field.name])}
                  onChange={(val) =>
                    handleFieldChange(field.name, val)
                  }
                  disabled={crud.modalMode === "view"}
                />
              );
            }

            /* ---------- FILE / TEXT / SELECT ---------- */
            return (
              <FormInput
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={(val) =>
                  handleFieldChange(field.name, val)
                }
                required={field.required}
                options={field.options}
                placeholder={field.placeholder}
                disabled={crud.modalMode === "view"}
                accept={field.accept}
                preview={field.preview}
              />
            );
          })}
        </div>
      </Modal>

      {/* ---------------------------------- */}
      {/* Delete Confirmation */}
      {/* ---------------------------------- */}
      <ConfirmDialog
        open={crud.isDeleteDialogOpen}
        onClose={crud.closeDeleteDialog}
        onConfirm={handleDelete}
        title={`Delete ${entityName}`}
        description={`Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        loading={crud.loading}
      />
    </div>
  );
};

export default CrudPage;
