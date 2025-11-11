import { useState, useRef, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Avatar,
  Space,
  Row,
  Col,
  Tag,
  Tooltip,
  Dropdown,
  message,
  Badge,
  Segmented,
  List,
} from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'suggestion';
  actions?: Array<{
    label: string;
    onClick: () => void;
    type: 'primary' | 'default';
  }>;
}

interface QuickAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  prompt: string;
}

export default function AIAgentPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'chat' | 'tutorial' | 'automation'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      sender: 'agent',
      text: t('aiAgent.welcomeMessage', {
        defaultValue:
          '¡Hola! Soy tu asistente de inversión AI. Puedo ayudarte a analizar tu portafolio, generar reportes, automatizar tareas y enseñarte sobre estrategias de inversión. ¿En qué puedo ayudarte hoy?',
      }),
      timestamp: new Date(),
      type: 'text',
    };
    setMessages([welcomeMessage]);
  }, [t]);

  const quickActions: QuickAction[] = [
    {
      key: 'analyze-portfolio',
      label: 'Analizar Portafolio',
      icon: <BarChartOutlined />,
      description: 'Análisis completo de tu portafolio actual',
      prompt: 'Analiza mi portafolio y dame recomendaciones',
    },
    {
      key: 'generate-report',
      label: 'Generar Reporte',
      icon: <FileTextOutlined />,
      description: 'Crear reporte de rendimiento mensual',
      prompt: 'Genera un reporte de rendimiento del último mes',
    },
    {
      key: 'market-insights',
      label: 'Insights de Mercado',
      icon: <BulbOutlined />,
      description: 'Últimas tendencias y oportunidades',
      prompt: 'Dame los últimos insights del mercado',
    },
    {
      key: 'rebalance-help',
      label: 'Ayuda con Rebalanceo',
      icon: <ThunderboltOutlined />,
      description: 'Guía paso a paso para rebalancear',
      prompt: '¿Cómo puedo rebalancear mi portafolio?',
    },
    {
      key: 'risk-assessment',
      label: 'Evaluar Riesgo',
      icon: <CheckCircleOutlined />,
      description: 'Análisis de riesgo de tu portafolio',
      prompt: 'Evalúa el nivel de riesgo de mi portafolio',
    },
    {
      key: 'tutorial-trading',
      label: 'Tutorial: Trading',
      icon: <BookOutlined />,
      description: 'Aprende sobre estrategias de trading',
      prompt: 'Enséñame sobre estrategias de trading',
    },
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(messageText);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();

    // Portfolio analysis
    if (
      lowerMessage.includes('analiza') ||
      lowerMessage.includes('portafolio') ||
      lowerMessage.includes('portfolio')
    ) {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `He analizado tu portafolio. Aquí está el resumen:\n\n📊 Valor Total: $85,000,000\n📈 Retorno YTD: +18.5%\n⚠️ Nivel de Riesgo: Moderado (42/100)\n\nRecomendaciones principales:\n1. BTC está sobreponderado (42% vs 38% óptimo) - Considera reducir 4%\n2. ETH muestra señales de crecimiento - Aumentar de 28% a 32%\n3. Tu ratio de Sharpe es 1.8, superior al benchmark de la industria\n\n¿Quieres que te ayude a implementar estas recomendaciones?`,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            label: 'Ver Rebalanceo Detallado',
            onClick: () => {
              message.success('Navegando a Rebalanceo AI...');
              // Navigate to rebalancing page
            },
            type: 'primary',
          },
          {
            label: 'Generar Reporte Completo',
            onClick: () => {
              message.info('Generando reporte PDF...');
            },
            type: 'default',
          },
        ],
      };
    }

    // Report generation
    if (
      lowerMessage.includes('reporte') ||
      lowerMessage.includes('report') ||
      lowerMessage.includes('informe')
    ) {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `Generando tu reporte mensual...\n\n✅ Rendimiento: +18.5% (vs +12.3% benchmark)\n✅ Mejor activo: SOL (+45.2%)\n✅ Operaciones ejecutadas: 247\n✅ Compliance: 100% - Sin alertas\n\nEl reporte completo incluye:\n• Análisis de rendimiento por activo\n• Comparación con benchmarks\n• Distribución geográfica\n• Métricas de riesgo ajustadas\n• Proyecciones a 6 meses\n\n¿Deseas exportar el reporte en PDF o Excel?`,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            label: 'Exportar PDF',
            onClick: () => {
              message.success('Descargando reporte PDF...');
            },
            type: 'primary',
          },
          {
            label: 'Exportar Excel',
            onClick: () => {
              message.success('Descargando reporte Excel...');
            },
            type: 'default',
          },
        ],
      };
    }

    // Market insights
    if (
      lowerMessage.includes('mercado') ||
      lowerMessage.includes('market') ||
      lowerMessage.includes('insights')
    ) {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `📈 Insights de Mercado - ${new Date().toLocaleDateString()}\n\n🔥 Tendencias Destacadas:\n• Bitcoin mantiene consolidación sobre $95K\n• Ethereum Layer 2s ganando tracción (+23% volumen)\n• DeFi TVL alcanza nuevo máximo: $180B\n• Sector RWA (Real World Assets) en crecimiento\n\n⚡ Oportunidades:\n• SOL: Momentum positivo, correlación con BTC fuerte\n• LINK: Integraciones institucionales aumentando\n• Staking yields en aumento (ETH 4.2%, SOL 7.1%)\n\n⚠️ Riesgos a Monitorear:\n• Volatilidad macro (decisiones Fed)\n• Regulación europea (MiCA implementation)\n• Concentración de liquidez en exchanges\n\n¿Quieres ajustar tu estrategia basado en estos insights?`,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            label: 'Ajustar Estrategia',
            onClick: () => {
              handleSendMessage('Ayúdame a ajustar mi estrategia');
            },
            type: 'primary',
          },
        ],
      };
    }

    // Rebalancing help
    if (
      lowerMessage.includes('rebalance') ||
      lowerMessage.includes('rebalanceo') ||
      lowerMessage.includes('rebalancear')
    ) {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `🎯 Guía de Rebalanceo\n\nEl rebalanceo es ajustar tu portafolio a las proporciones óptimas. Aquí están los pasos:\n\n1️⃣ Analizar Posición Actual\n   Tu portafolio actual muestra desviaciones:\n   - BTC: 42% (objetivo: 38%) ❌ Reducir 4%\n   - ETH: 28% (objetivo: 32%) ❌ Aumentar 4%\n\n2️⃣ Calcular Trades Necesarios\n   Basado en $85M de AUM:\n   - Vender: $3.4M en BTC\n   - Comprar: $3.4M en ETH\n\n3️⃣ Considerar Impacto\n   - Costos estimados: ~$8,500 (0.025%)\n   - Mejora esperada de Sharpe: +0.15\n   - Reducción de riesgo: -2.3%\n\n4️⃣ Ejecutar con AI\n   Puedo automatizar este proceso por ti.\n\n¿Quieres que ejecute el rebalanceo automáticamente?`,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            label: 'Ejecutar Rebalanceo AI',
            onClick: () => {
              message.success('Iniciando rebalanceo automático...');
            },
            type: 'primary',
          },
          {
            label: 'Revisión Manual',
            onClick: () => {
              message.info('Abriendo wizard de rebalanceo manual...');
            },
            type: 'default',
          },
        ],
      };
    }

    // Risk assessment
    if (lowerMessage.includes('riesgo') || lowerMessage.includes('risk')) {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `🛡️ Evaluación de Riesgo\n\nNivel de Riesgo Global: MODERADO (42/100)\n\n📊 Análisis Detallado:\n\n• Volatilidad: 28% anualizada ⚠️ Media-Alta\n  (Benchmark: 32%)\n\n• VaR (95%): -$4.2M en 1 día\n  Worst case pérdida estimada\n\n• Diversificación: 7.2/10 ✅ Buena\n  8 activos principales\n\n• Concentración: 42% en BTC ⚠️\n  Recomendar reducir a <40%\n\n• Correlación con mercado: 0.78\n  Alta exposición a movimientos generales\n\n• Liquidez: 95% ✅ Excelente\n  Puede salir de posiciones rápidamente\n\nRecomendaciones:\n1. Reducir concentración en BTC\n2. Aumentar exposición a activos descorrelacionados\n3. Considerar hedging con opciones\n\n¿Quieres implementar estrategias de mitigación de riesgo?`,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            label: 'Ver Estrategias de Hedging',
            onClick: () => {
              message.info('Cargando estrategias de hedging...');
            },
            type: 'primary',
          },
        ],
      };
    }

    // Tutorial/Learning
    if (
      lowerMessage.includes('tutorial') ||
      lowerMessage.includes('enseña') ||
      lowerMessage.includes('aprende') ||
      lowerMessage.includes('trading')
    ) {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `📚 Tutorial: Estrategias de Trading\n\nVoy a enseñarte las principales estrategias que usamos:\n\n1️⃣ Dollar Cost Averaging (DCA)\n   • Inversión periódica de monto fijo\n   • Reduce impacto de volatilidad\n   • Ideal para: Principiantes, inversión a largo plazo\n\n2️⃣ Rebalanceo Táctico\n   • Ajustar pesos basado en señales del mercado\n   • Capturar momentum\n   • Ideal para: Gestores activos\n\n3️⃣ Estrategia Multi-Manager (MUM)\n   • Diversificar entre varios gestores AI\n   • Cada uno con especialidad diferente\n   • Ideal para: Reducir riesgo, maximizar diversificación\n\n4️⃣ Mean Reversion\n   • Comprar activos "oversold"\n   • Vender activos "overbought"\n   • Ideal para: Mercados laterales\n\n¿Sobre cuál estrategia quieres aprender más?`,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            label: 'Tutorial DCA',
            onClick: () => {
              handleSendMessage('Explícame más sobre Dollar Cost Averaging');
            },
            type: 'primary',
          },
          {
            label: 'Tutorial MUM',
            onClick: () => {
              handleSendMessage('¿Cómo funcionan las estrategias Multi-Manager?');
            },
            type: 'default',
          },
        ],
      };
    }

    // Default response
    return {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      text: `Entiendo tu pregunta. Puedo ayudarte con:\n\n• 📊 Análisis de portafolio\n• 📈 Recomendaciones de inversión\n• 📄 Generación de reportes\n• ⚡ Automatización de rebalanceo\n• 📚 Tutoriales y educación\n• 💡 Insights del mercado\n\n¿Podrías ser más específico sobre lo que necesitas?`,
      timestamp: new Date(),
      type: 'suggestion',
    };
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt);
  };

  const modeOptions = [
    { label: 'Chat', value: 'chat', icon: <RobotOutlined /> },
    { label: 'Tutoriales', value: 'tutorial', icon: <BookOutlined /> },
    { label: 'Automatización', value: 'automation', icon: <ThunderboltOutlined /> },
  ];

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Row justify="space-between" align="middle">
                <Col>
                  <Space align="center">
                    <Avatar size={64} icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <div>
                      <h2 style={{ margin: 0 }}>
                        AI Agent <Badge status="success" text="En línea" />
                      </h2>
                      <p style={{ margin: 0, color: '#666' }}>
                        Asistente de Inversión Inteligente - Powered by GPT-4
                      </p>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Tooltip title="Configuración">
                      <Button icon={<SettingOutlined />} />
                    </Tooltip>
                    <Tooltip title="Historial">
                      <Button icon={<ClockCircleOutlined />} />
                    </Tooltip>
                    <Tooltip title="Ayuda">
                      <Button icon={<QuestionCircleOutlined />} />
                    </Tooltip>
                  </Space>
                </Col>
              </Row>

              <Segmented
                options={modeOptions}
                value={mode}
                onChange={(value) => setMode(value as any)}
                block
                size="large"
              />

              {/* Quick Actions */}
              {mode === 'chat' && (
                <div>
                  <h4 style={{ marginBottom: 12 }}>🚀 Acciones Rápidas</h4>
                  <Row gutter={[12, 12]}>
                    {quickActions.slice(0, 6).map((action) => (
                      <Col xs={24} sm={12} md={8} lg={4} key={action.key}>
                        <Tooltip title={action.description}>
                          <Button
                            block
                            icon={action.icon}
                            onClick={() => handleQuickAction(action)}
                            style={{ height: '60px' }}
                          >
                            <div style={{ fontSize: '12px', marginTop: '4px' }}>{action.label}</div>
                          </Button>
                        </Tooltip>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {mode === 'automation' && (
                <div>
                  <h4 style={{ marginBottom: 12 }}>⚡ Automatizaciones Disponibles</h4>
                  <List
                    dataSource={[
                      {
                        title: 'Rebalanceo Automático Semanal',
                        description: 'Rebalancea tu portafolio cada lunes a las 9:00 AM',
                        status: 'active',
                      },
                      {
                        title: 'Reportes Mensuales',
                        description: 'Genera y envía reporte de rendimiento el día 1 de cada mes',
                        status: 'active',
                      },
                      {
                        title: 'Alertas de Riesgo',
                        description: 'Notifica cuando el VaR supere el umbral del 5%',
                        status: 'active',
                      },
                      {
                        title: 'DCA Bitcoin',
                        description: 'Inversión de $10,000 en BTC cada semana',
                        status: 'paused',
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Tag color={item.status === 'active' ? 'green' : 'orange'}>
                            {item.status === 'active' ? 'Activo' : 'Pausado'}
                          </Tag>,
                          <Button size="small" type="link">
                            Configurar
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<RocketOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}

              {mode === 'tutorial' && (
                <div>
                  <h4 style={{ marginBottom: 12 }}>📚 Tutoriales Interactivos</h4>
                  <Row gutter={[12, 12]}>
                    {[
                      'Introducción a la Plataforma',
                      'Cómo Rebalancear tu Portafolio',
                      'Estrategias Multi-Manager (MUM)',
                      'Análisis de Riesgo',
                      'Generación de Reportes',
                      'Trading Algorítmico Básico',
                    ].map((tutorial, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <Card
                          hoverable
                          onClick={() => {
                            message.info(`Iniciando tutorial: ${tutorial}`);
                          }}
                          style={{ height: '100%' }}
                        >
                          <Space direction="vertical" align="center" style={{ width: '100%' }}>
                            <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                            <div style={{ textAlign: 'center', fontSize: '14px' }}>{tutorial}</div>
                            <Tag color="blue">{Math.floor(Math.random() * 20) + 5} min</Tag>
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Chat Messages */}
      {mode === 'chat' && (
        <>
          <Card
            style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, overflow: 'auto', padding: '16px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Space align="start" direction="horizontal" style={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                    <Avatar
                      icon={msg.sender === 'agent' ? <RobotOutlined /> : <UserOutlined />}
                      style={{
                        backgroundColor: msg.sender === 'agent' ? '#1890ff' : '#52c41a',
                      }}
                    />
                    <div>
                      <Card
                        size="small"
                        style={{
                          maxWidth: 600,
                          backgroundColor: msg.sender === 'user' ? '#e6f7ff' : '#f0f0f0',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        <p style={{ margin: 0 }}>{msg.text}</p>
                        {msg.actions && msg.actions.length > 0 && (
                          <Space style={{ marginTop: 12 }}>
                            {msg.actions.map((action, index) => (
                              <Button
                                key={index}
                                type={action.type}
                                size="small"
                                onClick={action.onClick}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </Space>
                        )}
                      </Card>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </Space>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Space align="start">
                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <Card size="small" style={{ backgroundColor: '#f0f0f0' }}>
                      <span>Escribiendo...</span>
                    </Card>
                  </Space>
                </div>
              )}
              <div ref={messagesEndRef} />
            </Space>
          </Card>

          {/* Input Area */}
          <Card style={{ marginTop: 16 }}>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                size="large"
                placeholder="Escribe tu pregunta o solicitud..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={() => handleSendMessage()}
                prefix={<QuestionCircleOutlined />}
              />
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
              >
                Enviar
              </Button>
            </Space.Compact>
          </Card>
        </>
      )}
    </div>
  );
}
