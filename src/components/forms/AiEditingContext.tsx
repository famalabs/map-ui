import React, { createContext, ReactNode } from 'react';

interface AiEditingContextType {
  aiEditingField: string | null;
  setAiEditingField: (fieldName: string | null) => void;
  aiDirtyFields: Set<string>;
  markAiDirty: (fieldName: string) => void;
  clearAiDirty: (fieldName: string) => void;
  clearAllAiDirty: () => void;
  typewriterSpeed: number;
  setTypewriterSpeed: (speed: number) => void;
}

const AiEditingContext = createContext<AiEditingContextType | undefined>(undefined);
export const AiEditingProvider = ({
  defaultEditSpeed = 10,
  children,
}: {
  defaultEditSpeed?: number;
  children: ReactNode;
}) => {
  const [aiDirtyFields, setAiDirtyFields] = React.useState<Set<string>>(new Set());
  const [aiEditingField, setAiEditingField] = React.useState<string | null>(null);
  const [typewriterSpeed, setTypewriterSpeed] = React.useState<number>(defaultEditSpeed);

  const markAiDirty = React.useCallback((fieldName: string) => {
    setAiDirtyFields((prev) => new Set(prev).add(fieldName));
  }, []);

  const clearAiDirty = React.useCallback((fieldName: string) => {
    setAiDirtyFields((prev) => {
      const next = new Set(prev);
      next.delete(fieldName);
      return next;
    });
  }, []);

  const clearAllAiDirty = React.useCallback(() => {
    setAiDirtyFields(new Set());
  }, []);

  return (
    <AiEditingContext.Provider
      value={{
        aiEditingField,
        setAiEditingField,
        aiDirtyFields,
        markAiDirty,
        clearAiDirty,
        clearAllAiDirty,
        typewriterSpeed,
        setTypewriterSpeed,
      }}
    >
      {children}
    </AiEditingContext.Provider>
  );
};

export const useAiEditing = () => {
  const context = React.useContext(AiEditingContext);
  return (
    context ?? {
      aiEditingField: null,
      setAiEditingField: () => {},
      aiDirtyFields: new Set<string>(),
      markAiDirty: () => {},
      clearAiDirty: () => {},
      clearAllAiDirty: () => {},
      typewriterSpeed: 10,
      setTypewriterSpeed: () => {},
    }
  );
};

export const useIsAiEditing = (fieldName: string | undefined) => {
  const { aiEditingField } = useAiEditing();
  if (!fieldName) return false;
  return aiEditingField === fieldName;
};

export const useIsAiDirty = (fieldName: string | undefined) => {
  const { aiDirtyFields } = useAiEditing();
  if (!fieldName) return false;
  return aiDirtyFields.has(fieldName);
};

export const useTypewriterSpeed = () => {
  const { typewriterSpeed } = useAiEditing();
  return typewriterSpeed;
};
