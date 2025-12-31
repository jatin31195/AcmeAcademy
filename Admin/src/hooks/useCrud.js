import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useCrud({ service, entityName, idField = "id" }) {
  const [state, setState] = useState({
    items: [],
    loading: false,
    error: null,
    selectedItem: null,
    isModalOpen: false,
    isDeleteDialogOpen: false,
    modalMode: "create", // create | edit | view
    total: 0,
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchItems = useCallback(
    async (params = {}) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await service.getAll(params);
        setState((prev) => ({
          ...prev,
          items: result?.data || [],
          total: result?.total || 0,
          loading: false,
        }));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch data";
        setState((prev) => ({ ...prev, loading: false, error: message }));
        useToast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    },
    [service]
  );

  const createItem = useCallback(
    async (data) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        await service.create(data);
        useToast({
          title: "Success",
          description: `${entityName} created successfully`,
        });
        setState((prev) => ({
          ...prev,
          isModalOpen: false,
          loading: false,
        }));
        setRefreshTrigger((prev) => prev + 1);
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create";
        useToast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        setState((prev) => ({ ...prev, loading: false }));
        return false;
      }
    },
    [service, entityName]
  );

  const updateItem = useCallback(
    async (id, data) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        await service.update(id, data);
        useToast({
          title: "Success",
          description: `${entityName} updated successfully`,
        });
        setState((prev) => ({
          ...prev,
          isModalOpen: false,
          loading: false,
        }));
        setRefreshTrigger((prev) => prev + 1);
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update";
        useToast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        setState((prev) => ({ ...prev, loading: false }));
        return false;
      }
    },
    [service, entityName]
  );

  const deleteItem = useCallback(
    async (item) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        await service.delete(item[idField]);
        useToast({
          title: "Success",
          description: `${entityName} deleted successfully`,
        });
        setState((prev) => ({
          ...prev,
          isDeleteDialogOpen: false,
          selectedItem: null,
          loading: false,
        }));
        setRefreshTrigger((prev) => prev + 1);
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete";
        useToast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        setState((prev) => ({ ...prev, loading: false }));
        return false;
      }
    },
    [service, entityName, idField]
  );

  const openCreateModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedItem: null,
      modalMode: "create",
      isModalOpen: true,
    }));
  }, []);

  const openEditModal = useCallback((item) => {
    setState((prev) => ({
      ...prev,
      selectedItem: item,
      modalMode: "edit",
      isModalOpen: true,
    }));
  }, []);

  const openViewModal = useCallback((item) => {
    setState((prev) => ({
      ...prev,
      selectedItem: item,
      modalMode: "view",
      isModalOpen: true,
    }));
  }, []);

  const openDeleteDialog = useCallback((item) => {
    setState((prev) => ({
      ...prev,
      selectedItem: item,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      selectedItem: null,
    }));
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDeleteDialogOpen: false,
      selectedItem: null,
    }));
  }, []);

  return {
    ...state,
    refreshTrigger,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    openCreateModal,
    openEditModal,
    openViewModal,
    openDeleteDialog,
    closeModal,
    closeDeleteDialog,
  };
}

export default useCrud;
