"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VulnerableContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Visitante";

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Página de Teste DAST</h1>
      <p>Bem-vindo ao sistema de simulação de vulnerabilidades.</p>
      
      {/* 
          SIMULAÇÃO DE XSS: 
          Estamos usando dangerouslySetInnerHTML para renderizar o que vier na query string 'name'.
          Um atacante poderia passar ?name=<script>alert('XSS')</script>
      */}
      <div className="vulnerability-box" style={{ border: "1px solid red", padding: "10px", marginTop: "20px" }}>
        <h3>Olá, <span dangerouslySetInnerHTML={{ __html: name }} />!</h3>
        <p>Esta área renderiza input do usuário sem sanitização para testes de DAST.</p>
      </div>

      <div style={{ marginTop: "40px", fontSize: "0.8em", color: "#666" }}>
        <p>Nota: Esta página foi criada apenas para validar o scanner de segurança.</p>
      </div>
    </div>
  );
}

export default function VulnerablePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VulnerableContent />
    </Suspense>
  );
}
