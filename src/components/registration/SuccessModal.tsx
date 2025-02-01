import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const SuccessModal = ({ open, onClose, onContinue }: SuccessModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastro Realizado com Sucesso!</DialogTitle>
          <DialogDescription>
            O associado foi cadastrado com sucesso.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Ver Lista
          </Button>
          <Button onClick={onContinue}>
            Novo Cadastro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;