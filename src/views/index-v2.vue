<template>
  <div v-if="isMerchant" class="merchant-dashboard">
    <!-- Google Authenticator Binding Dialog -->
    <el-dialog
      v-model="googleBindingDialogVisible"
      title="绑定谷歌验证器"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
    >
      <div class="google-auth-setup">
        <el-steps :active="googleBindingStep" finish-status="success" simple style="width: 100%">
          <el-step title="下载" />
          <el-step title="扫码" />
          <el-step title="验证" />
        </el-steps>
        
        <div v-if="googleBindingStep === 0" class="step-content">
          <div class="step-title">步骤 1: 下载谷歌验证器应用</div>
          <p>请在您的移动设备上下载并安装谷歌验证器应用：</p>
          <div class="app-links">
            <el-link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" type="primary">
              <el-icon><Download /></el-icon> 安卓 - Google Play
            </el-link>
            <el-link href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank" type="primary">
              <el-icon><Download /></el-icon> 苹果 - App Store
            </el-link>
          </div>
          <div class="step-actions">
            <el-button type="primary" @click="googleBindingStep = 1">下一步</el-button>
          </div>
        </div>
        
        <div v-if="googleBindingStep === 1" class="step-content">
          <div class="step-title">步骤 2: 扫描二维码</div>
          <p>打开谷歌验证器应用并扫描此二维码：</p>
          <div class="qrcode-container">
            <qrcode-vue :value="googleAuthSecret" :size="200" level="H" class="qrcode-image" />
          </div>
          <div class="secret-key">
            <p>手动输入密钥：</p>
            <el-tag size="large">{{ googleAuthSecretKey }}</el-tag>
            <el-button link type="primary" size="small" @click="copyText(googleAuthSecretKey)">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
          <div class="step-actions">
            <el-button @click="googleBindingStep = 0">返回</el-button>
            <el-button type="primary" @click="googleBindingStep = 2">下一步</el-button>
          </div>
        </div>
        
        <div v-if="googleBindingStep === 2" class="step-content">
          <div class="step-title">步骤 3: 验证码确认</div>
          <p>请输入谷歌验证器应用中的6位验证码：</p>
          <el-form :model="googleBindingForm" :rules="googleBindingRules" ref="googleBindingFormRef">
            <el-form-item prop="verificationCode">
              <el-input 
                v-model="googleBindingForm.verificationCode" 
                placeholder="请输入6位验证码"
                maxlength="6"
                class="verification-input"
              />
            </el-form-item>
            <div class="step-actions">
              <el-button @click="googleBindingStep = 1">返回</el-button>
              <el-button type="primary" @click="verifyAndBindGoogleAuth">完成绑定</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <!-- 商户余额卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="balance-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3><el-icon><Money /></el-icon> 商户余额</h3>
              <div class="wallet-controls">
                <el-tabs v-model="walletTab" class="wallet-tabs">
                  <el-tab-pane label="热钱包" name="hot"></el-tab-pane>
                  <el-tab-pane label="冷钱包" name="cold"></el-tab-pane>
                </el-tabs>
                <el-switch
                  v-model="isTestnet"
                  active-text="测试网"
                  inactive-text="主网"
                  @change="handleNetworkChange"
                />
              </div>
            </div>
          </template>
          
          <!-- 热钱包信息 -->
          <div v-if="walletTab === 'hot'">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="wallet-section">
                  <div class="wallet-title">TRON链 {{ isTestnet ? '(测试网)' : '(主网)' }}</div>
                  <div class="balance-amount">
                    <span class="label">USDT余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.hot.usdt.tron, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">待归集USDT余额:</span>
                    <span class="amount">{{ isTestnet ? truncateDecimal(balanceData.hot.pendingCollection.tronTestUsdt, 2) : truncateDecimal(balanceData.hot.pendingCollection.tronUsdt, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">TRX余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.hot.trx, 4) }}</span>
                  </div>
                  <div class="wallet-address">
                    <div class="address-label">热钱包地址:</div>
                    <div class="address-value">
                      <el-input :value="walletAddresses.hot.tron" size="small" readonly>
                        <template #append>
                          <el-button @click="copyText(walletAddresses.hot.tron)">
                            <el-icon><CopyDocument /></el-icon>
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="wallet-section">
                  <div class="wallet-title">ETH链 {{ isTestnet ? '(测试网)' : '(主网)' }}</div>
                  <div class="balance-amount">
                    <span class="label">USDT余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.hot.usdt.eth, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">待归集USDT余额:</span>
                    <span class="amount">{{ isTestnet ? truncateDecimal(balanceData.hot.pendingCollection.ethSepoliaUsdt, 2) : truncateDecimal(balanceData.hot.pendingCollection.ethUsdt, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">ETH余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.hot.eth, 4) }}</span>
                  </div>
                  <div class="wallet-address">
                    <div class="address-label">热钱包地址:</div>
                    <div class="address-value">
                      <el-input :value="walletAddresses.hot.eth" size="small" readonly>
                        <template #append>
                          <el-button @click="copyText(walletAddresses.hot.eth)">
                            <el-icon><CopyDocument /></el-icon>
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="wallet-section">
                  <div class="wallet-title">BSC链 {{ isTestnet ? '(测试网)' : '(主网)' }}</div>
                  <div class="balance-amount">
                    <span class="label">USDT余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.hot.usdt.bsc, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">待归集USDT余额:</span>
                    <span class="amount">{{ isTestnet ? truncateDecimal(balanceData.hot.pendingCollection.bscTestUsdt, 2) : truncateDecimal(balanceData.hot.pendingCollection.bscUsdt, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">BNB余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.hot.bnb, 4) }}</span>
                  </div>
                  <div class="wallet-address">
                    <div class="address-label">热钱包地址:</div>
                    <div class="address-value">
                      <el-input :value="walletAddresses.hot.bsc" size="small" readonly>
                        <template #append>
                          <el-button @click="copyText(walletAddresses.hot.bsc)">
                            <el-icon><CopyDocument /></el-icon>
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <!-- 冷钱包信息 -->
          <div v-if="walletTab === 'cold'">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="wallet-section">
                  <div class="wallet-title">TRON链 {{ isTestnet ? '(测试网)' : '(主网)' }}</div>
                  <div class="balance-amount">
                    <span class="label">USDT余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.cold.usdt.tron, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">TRX余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.cold.trx, 4) }}</span>
                  </div>
                  <div class="wallet-address">
                    <div class="address-label">冷钱包地址:</div>
                    <div class="address-value">
                      <el-input :value="walletAddresses.cold.tron" size="small" readonly>
                        <template #append>
                          <el-button @click="copyText(walletAddresses.cold.tron)" style="margin-right: 5px;">
                            <el-icon><CopyDocument /></el-icon>
                          </el-button>
                          <el-button @click="editColdWalletAddress('tron')">
                            <el-icon><Edit /></el-icon>
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="wallet-section">
                  <div class="wallet-title">ETH链 {{ isTestnet ? '(测试网)' : '(主网)' }}</div>
                  <div class="balance-amount">
                    <span class="label">USDT余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.cold.usdt.eth, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">ETH余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.cold.eth, 4) }}</span>
                  </div>
                  <div class="wallet-address">
                    <div class="address-label">冷钱包地址:</div>
                    <div class="address-value">
                      <el-input :value="walletAddresses.cold.eth" size="small" readonly>
                        <template #append>
                          <el-button @click="copyText(walletAddresses.cold.eth)" style="margin-right: 5px;">
                            <el-icon><CopyDocument /></el-icon>
                          </el-button>
                          <el-button @click="editColdWalletAddress('eth')">
                            <el-icon><Edit /></el-icon>
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="wallet-section">
                  <div class="wallet-title">BSC链 {{ isTestnet ? '(测试网)' : '(主网)' }}</div>
                  <div class="balance-amount">
                    <span class="label">USDT余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.cold.usdt.bsc, 2) }}</span>
                  </div>
                  <div class="balance-amount">
                    <span class="label">BNB余额:</span>
                    <span class="amount">{{ truncateDecimal(balanceData.cold.bnb, 4) }}</span>
                  </div>
                  <div class="wallet-address">
                    <div class="address-label">冷钱包地址:</div>
                    <div class="address-value">
                      <el-input :value="walletAddresses.cold.bsc" size="small" readonly>
                        <template #append>
                          <el-button @click="copyText(walletAddresses.cold.bsc)" style="margin-right: 5px;">
                            <el-icon><CopyDocument /></el-icon>
                          </el-button>
                          <el-button @click="editColdWalletAddress('bsc')">
                            <el-icon><Edit /></el-icon>
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <div class="balance-actions mt-20">
            <el-button type="primary" @click="openRechargeDialog">充值</el-button>
            <el-button type="warning" @click="openWithdrawDialog">提现</el-button>
            <el-button type="success" @click="openUserRechargeTestDialog">用户充值测试</el-button>
          </div>
        </el-card>
      </el-col>

    </el-row>
    
    <!-- API信息和数据概览 -->
    <el-row :gutter="20" class="mt-20" >
      <!-- API信息卡片 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="api-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3><el-icon><Connection /></el-icon> API接口信息</h3>
            </div>
          </template>
          <div class="api-info">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="Token">
                <div class="api-value-container">
                  <el-tag size="small" v-if="apiInfo.tokenVisible">{{ apiInfo.token }}</el-tag>
                  <el-tag size="small" v-else>****************</el-tag>
                  <div class="api-actions">
                    <el-button link type="primary" size="small" @click="showApiValue('token')" v-if="!apiInfo.tokenVisible">
                      <el-icon><View /></el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="hideApiValue('token')" v-else>
                      <el-icon><Hide /></el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="copyText(apiInfo.token)" v-if="apiInfo.tokenVisible">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Secret">
                <div class="api-value-container">
                  <div v-if="apiInfo.secretVisible" style="word-break: break-all;">
                    <el-tag size="small" style="max-width: 100%; white-space: normal; height: auto; line-height: 1.5; padding: 5px;">{{ apiInfo.secret }}</el-tag>
                  </div>
                  <el-tag size="small" v-else>****************</el-tag>
                  <div class="api-actions">
                    <el-button link type="primary" size="small" @click="showApiValue('secret')" v-if="!apiInfo.secretVisible">
                      <el-icon><View /></el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="hideApiValue('secret')" v-else>
                      <el-icon><Hide /></el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="copyText(apiInfo.secret)" v-if="apiInfo.secretVisible">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="回调地址">
                <div class="api-value-container">
                  <el-tag size="small">{{ apiInfo.callbackUrl }}</el-tag>
                  <div class="api-actions">
                    <el-button link type="primary" size="small" @click="editCallbackUrl">
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="copyText(apiInfo.callbackUrl)">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="IP白名单">
                <div class="ip-whitelist-container">
                  <div class="ip-whitelist-tags">
                    <el-tag 
                      v-for="(ip, index) in apiInfo.ipWhitelist" 
                      :key="index" 
                      class="ip-tag"
                    >
                      {{ ip }}
                    </el-tag>
                    <el-button 
                      class="add-ip-button" 
                      type="primary" 
                      size="small" 
                      @click="openAddIpDialog"
                    >
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </div>
                  <div class="ip-whitelist-info">
                    <small>最多可添加10个IP地址，当前已添加 {{ apiInfo.ipWhitelist.length }} 个</small>
                    <small>（多个IP地址请换行输入，每行一个IP）</small>
                  </div>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <div class="api-doc-link">
              <!-- <el-link type="primary" href="https://vtqvpkz5zj.apifox.cn" target="_blank"> -->
              <el-link type="primary" href="https://docs.xpaylabs.com" target="_blank">
                <el-icon><Document /></el-icon> API接入文档
              </el-link>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-show="true">
        <el-card class="data-overview-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3><el-icon><Connection /></el-icon> TRON（主网）能量租赁绑定</h3>
            </div>
          </template>
          <el-row :gutter="20">
            <!-- 已绑定状态 -->
            <el-col :span="24" v-if="energyPlatform.isBound" class="energy-bound-info">
              <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="TRX余额">
                  <el-tag type="success">{{ energyPlatform.trxBalance }} TRX</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="绑定地址">
                  <div class="address-container">
                    <el-text class="address-text">{{ energyPlatform.boundAddress }}</el-text>
                    <el-button link type="primary" size="small" @click="copyText(energyPlatform.boundAddress)">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="充值地址">
                  <div class="address-container">
                    <el-text class="address-text">{{ energyPlatform.rechargeAddress }}</el-text>
                    <el-button link type="primary" size="small" @click="copyText(energyPlatform.rechargeAddress)">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
              <!-- <div class="energy-actions" style="margin-top: 16px;">
                <el-button type="primary" @click="refreshEnergyInfo">刷新信息</el-button>
              </div> -->
            </el-col>
            
            <!-- 未绑定状态 - 显示绑定流程 -->
            <el-col :span="24" v-else class="energy-binding-flow">
              <!-- 响应式步骤条 -->
              <div class="steps-container">
                <el-steps 
                  :active="energyBindingStep" 
                  finish-status="success" 
                  :direction="stepsDirection"
                  align-center
                  class="energy-steps"
                >
                  <el-step title="注册账户" description="在feee.io注册" />
                  <el-step title="充值TRX" description="充值TRX到账户" />
                  <el-step title="创建API" description="创建API密钥" />
                  <el-step title="绑定完成" description="输入密钥完成绑定" />
                </el-steps>
              </div>
              
              <div class="binding-content">
                <el-alert
                  title="TRON能量租赁绑定流程"
                  type="info"
                  :closable="false"
                  show-icon
                  class="binding-alert"
                >
                  <template #default>
                    <ol class="binding-steps-list">
                      <li>访问 <el-link href="https://feee.io/" target="_blank" type="primary">https://feee.io/</el-link> 注册账户</li>
                      <li>在平台充值TRX用于能量租赁</li>
                      <li>在平台创建API密钥，UA白名单中添加 <code>x-pay</code> <el-tag type="danger" size="small">⚠️ 必须配置</el-tag></li>
                      <li>在下方输入API密钥和谷歌验证码完成绑定</li>
                    </ol>
                  </template>
                </el-alert>
                
                <el-form 
                  :model="energyBindingForm" 
                  :rules="energyBindingRules" 
                  ref="energyBindingFormRef" 
                  label-width="100px"
                  class="energy-binding-form"
                >
                  <el-form-item label="API密钥" prop="apiKey">
                    <el-input 
                      v-model="energyBindingForm.apiKey" 
                      placeholder="请输入从feee.io获取的API密钥"
                      show-password
                      size="default"
                    />
                  </el-form-item>
                  <el-form-item label="谷歌验证码" prop="googleCode">
                    <el-input 
                      v-model="energyBindingForm.googleCode" 
                      placeholder="请输入6位谷歌验证码"
                      maxlength="6"
                      size="default"
                    />
                  </el-form-item>
                  <el-form-item class="form-actions">
                    <el-button 
                      type="primary" 
                      @click="bindEnergyPlatform" 
                      :loading="energyBindingLoading"
                      size="default"
                    >
                      完成绑定
                    </el-button>
                    <el-button @click="resetEnergyBindingForm" size="default">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 数据统计卡片 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-show="false">
        <el-card class="stats-overview-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3><el-icon><DataAnalysis /></el-icon> 数据概览</h3>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="今日数据" name="today">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="stat-item">
                    <div class="stat-title">今日入账</div>
                    <div class="stat-value">{{ todayStats.incomingCount }}笔</div>
                    <div class="stat-rate">
                      成功率: {{ todayStats.incomingRate }}
                      <el-progress :percentage="parseFloat(todayStats.incomingRate)" />
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="stat-item">
                    <div class="stat-title">今日出账</div>
                    <div class="stat-value">{{ todayStats.outgoingCount }}笔</div>
                    <div class="stat-rate">
                      成功率: {{ todayStats.outgoingRate }}
                      <el-progress :percentage="parseFloat(todayStats.outgoingRate)" />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="全部数据" name="all">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="stat-item">
                    <div class="stat-title">全部入账</div>
                    <div class="stat-value">{{ allStats.incomingCount }}笔</div>
                    <div class="stat-rate">
                      成功率: {{ allStats.incomingRate }}
                      <el-progress :percentage="parseFloat(allStats.incomingRate)" />
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="stat-item">
                    <div class="stat-title">全部出账</div>
                    <div class="stat-value">{{ allStats.outgoingCount }}笔</div>
                    <div class="stat-rate">
                      成功率: {{ allStats.outgoingRate }}
                      <el-progress :percentage="parseFloat(allStats.outgoingRate)" />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细数据表格 -->
    <el-row :gutter="20" class="mt-20" v-show="false">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3><el-icon><Histogram /></el-icon> 详细数据</h3>
              <el-radio-group v-model="detailType" size="small">
                <el-radio-button value="incoming" label="入账数据" />
                <el-radio-button value="outgoing" label="出账数据" />
              </el-radio-group>
            </div>
          </template>
          
          <el-tabs v-model="detailPeriod">
            <el-tab-pane label="今日数据" name="today">
              <el-table :data="getDetailData()" stripe style="width: 100%">
                <el-table-column prop="currency" label="币种" width="180" />
                <el-table-column prop="amount" label="数量" width="180" />
                <el-table-column prop="chain" label="链" />
                <el-table-column prop="count" label="笔数" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="全部数据" name="all">
              <el-table :data="getDetailData()" stripe style="width: 100%">
                <el-table-column prop="currency" label="币种" width="180" />
                <el-table-column prop="amount" label="数量" width="180" />
                <el-table-column prop="chain" label="链" />
                <el-table-column prop="count" label="笔数" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- 充值对话框 -->
    <el-dialog
      v-model="rechargeDialogVisible"
      :title="`充值 ${isTestnet ? '(测试网)' : '(主网)'}`"
      width="500px"
      destroy-on-close
    >
      <el-form :model="rechargeForm" label-width="120px">
        <el-form-item label="币种">
          <el-select v-model="rechargeForm.currency" placeholder="请选择币种">
            <el-option label="USDT" value="USDT" />
            <el-option label="ETH" value="ETH" />
            <el-option label="TRX" value="TRX" />
            <el-option label="BNB" value="BNB" />
          </el-select>
        </el-form-item>
        <el-form-item label="链" v-if="rechargeForm.currency === 'USDT'">
          <el-select v-model="rechargeForm.chain" placeholder="请选择链">
            <el-option v-if="!isTestnet" label="TRON" value="TRON" />
            <el-option v-if="isTestnet" label="TRON (测试网)" value="TRON_TEST" />
            <el-option v-if="!isTestnet" label="ETH" value="ETH" />
            <el-option v-if="isTestnet" label="ETH (Sepolia)" value="ETH_SEPOLIA" />
            <el-option v-if="!isTestnet" label="BSC" value="BSC" />
            <el-option v-if="isTestnet" label="BSC (测试网)" value="BSC_TEST" />
          </el-select>
        </el-form-item>
        <el-divider />
        <div class="recharge-address-info">
          <p class="address-label">充值地址:</p>
          <div class="address-value">
            <el-input :value="getRechargeAddress()" readonly>
              <template #append>
                <el-button @click="copyText(getRechargeAddress())">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="qrcode-container">
            <qrcode-vue :value="getRechargeAddress()" :size="200" level="H" class="qrcode-image" />
          </div>
          <el-alert
            title="充值提示"
            type="warning"
            description="请确保从正规渠道转账，充值将在区块确认后到账，一般需要10-30分钟。"
            show-icon
            :closable="false"
          />
        </div>
      </el-form>
    </el-dialog>

    <!-- 提现对话框 -->
    <el-dialog
      v-model="withdrawDialogVisible"
      :title="`提现 ${isTestnet ? '(测试网)' : '(主网)'}`"
      width="560px"
      destroy-on-close
    >
      <el-form :model="withdrawForm" :rules="withdrawRules" ref="withdrawFormRef" label-width="100px">
        <el-form-item label="币种" prop="currency">
          <el-select v-model="withdrawForm.currency" placeholder="请选择币种">
            <el-option label="USDT" value="USDT" />
            <el-option label="ETH" value="ETH" />
            <el-option label="TRX" value="TRX" />
            <el-option label="BNB" value="BNB" />
          </el-select>
        </el-form-item>
        <el-form-item label="链" prop="chain" v-if="withdrawForm.currency === 'USDT'">
          <el-select v-model="withdrawForm.chain" placeholder="请选择链">
            <el-option v-if="!isTestnet" label="TRON" value="TRON" />
            <el-option v-if="isTestnet" label="TRON (测试网)" value="TRON_TEST" />
            <el-option v-if="!isTestnet" label="ETH" value="ETH" />
            <el-option v-if="isTestnet" label="ETH (Sepolia)" value="ETH_SEPOLIA" />
            <el-option v-if="!isTestnet" label="BSC" value="BSC" />
            <el-option v-if="isTestnet" label="BSC (测试网)" value="BSC_TEST" />
          </el-select>
        </el-form-item>
        <el-form-item label="提现地址">
          <el-input :value="getWithdrawAddress()" readonly>
            <template #append>
              <el-button @click="copyText(getWithdrawAddress())">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </template>
          </el-input>
          <div class="form-tip">提现地址为对应链的冷钱包地址</div>
        </el-form-item>
        <el-form-item label="提现数量" prop="amount">
          <el-input-number 
            v-model="withdrawForm.amount" 
            :min="getMinWithdrawAmount()"
            :max="maxWithdrawAmount > getMinWithdrawAmount() ? maxWithdrawAmount : getMinWithdrawAmount()"
            :precision="withdrawForm.currency === 'USDT' || withdrawForm.currency === 'TRX' ? 2 : 4"
            style="width: 100%"
          />
          <div class="form-tip">
            <div>
              最小提币数量: {{ getMinWithdrawAmount() }} {{ withdrawForm.currency }}
            </div>
            <div>
              最大可提现: <span id="maxWithdrawAmount">{{ truncateDecimal(maxWithdrawAmount, withdrawForm.currency === 'USDT' || withdrawForm.currency === 'TRX' ? 2 : 4) }}</span>
              {{ withdrawForm.currency }}
              <el-tooltip content="已扣除gas费和平台手续费" placement="top">
                <el-icon class="info-icon"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
            <div>
              提现手续费: {{ merchant?.feeRatio || 0.5 }}%
            </div>
          </div>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="withdrawForm.googleCode" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitWithdraw">提交</el-button>
          <el-button @click="withdrawDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 谷歌验证码对话框 -->
    <el-dialog
      v-model="googleVerifyDialogVisible"
      title="谷歌验证"
      width="400px"
      destroy-on-close
    >
      <el-form :model="googleVerifyForm" :rules="googleVerifyRules" ref="googleVerifyFormRef" label-width="100px">
        <el-form-item label="谷歌验证码" prop="code">
          <el-input v-model="googleVerifyForm.code" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitGoogleVerify">确认</el-button>
          <el-button @click="googleVerifyDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改回调地址对话框 -->
    <el-dialog
      v-model="editCallbackDialogVisible"
      title="修改回调地址"
      width="500px"
      destroy-on-close
    >
      <el-form :model="editCallbackForm" :rules="editCallbackRules" ref="editCallbackFormRef" label-width="100px">
        <el-form-item label="回调地址" prop="url">
          <el-input v-model="editCallbackForm.url" placeholder="请输入新的回调地址" />
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="editCallbackForm.googleCode" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditCallback">确认修改</el-button>
          <el-button @click="editCallbackDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <!-- 用户充值测试对话框 -->
    <el-dialog
      v-model="userRechargeTestDialogVisible"
      title="用户充值测试"
      width="500px"
      destroy-on-close
    >
      <el-form :model="userRechargeTestForm" label-width="120px">
        <el-form-item label="币种">
          <el-select v-model="userRechargeTestForm.currency" placeholder="请选择币种">
            <el-option label="USDT" value="USDT" />
            <el-option label="ETH" value="ETH" />
            <el-option label="TRX" value="TRX" />
            <el-option label="BNB" value="BNB" />
          </el-select>
        </el-form-item>
        <el-form-item label="链" v-if="userRechargeTestForm.currency === 'USDT'">
          <el-select v-model="userRechargeTestForm.chain" placeholder="请选择链">
            <el-option v-if="!isTestnet" label="TRON" value="TRON" />
            <el-option v-if="isTestnet" label="TRON (测试网)" value="TRON_TEST" />
            <el-option v-if="!isTestnet" label="ETH" value="ETH" />
            <el-option v-if="isTestnet" label="ETH (Sepolia)" value="ETH_SEPOLIA" />
            <el-option v-if="!isTestnet" label="BSC" value="BSC" />
            <el-option v-if="isTestnet" label="BSC (测试网)" value="BSC_TEST" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input 
            v-model="userRechargeTestForm.uid" 
            placeholder="请输入用户ID"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="充值金额">
          <el-input-number 
            v-model="userRechargeTestForm.amount" 
            :min="0.001"
            :precision="userRechargeTestForm.currency === 'USDT' || userRechargeTestForm.currency === 'TRX' ? 2 : 4"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goToUserRechargeTest">确认</el-button>
          <el-button @click="userRechargeTestDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <!-- 修改冷钱包地址对话框 -->
    <el-dialog
      v-model="editColdWalletDialogVisible"
      title="修改冷钱包地址"
      width="500px"
      destroy-on-close
    >
      <el-form :model="editColdWalletForm" :rules="editColdWalletRules" ref="editColdWalletFormRef" label-width="100px">
        <el-form-item label="链">
          <el-tag>{{ editColdWalletForm.chain === 'tron' ? 'TRON' : editColdWalletForm.chain === 'eth' ? 'ETH' : 'BSC' }}</el-tag>
        </el-form-item>
        <el-form-item label="钱包地址" prop="address">
          <el-input v-model="editColdWalletForm.address" placeholder="请输入新的冷钱包地址" />
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="editColdWalletForm.googleCode" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditColdWallet">确认修改</el-button>
          <el-button @click="editColdWalletDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- IP白名单对话框 -->
    <el-dialog
      v-model="addIpDialogVisible"
      title="添加IP白名单"
      width="500px"
      destroy-on-close
    >
      <el-form :model="addIpForm" :rules="addIpRules" ref="addIpFormRef" label-width="100px">
        <el-form-item label="IP地址" prop="ipList">
          <el-input 
            v-model="addIpForm.ipList" 
            type="textarea" 
            :rows="5" 
            placeholder="请输入IP地址，多个IP请换行输入，每行一个IP"
          />
          <div class="ip-input-tip">
            <small>最多可添加10个IP地址，当前已添加 {{ apiInfo.ipWhitelist.length }} 个，还可添加 {{ 10 - apiInfo.ipWhitelist.length }} 个</small>
          </div>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="addIpForm.googleCode" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddIp">确认添加</el-button>
          <el-button @click="addIpDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Money, Connection, Document, CopyDocument, DataAnalysis, Histogram, View, Hide, Edit, Download, InfoFilled, Plus } from '@element-plus/icons-vue';
import QrcodeVue from 'qrcode.vue';
import { bind2fa, verify2fa, merchantInfo, merchantApiKey, withdrawal, updateCallbackUrl, updateColdAddress, setWhitelistIp, setEnergyApikey, energyPlatformInfo } from '@/api/xpay/merchant';
import { myAddressList } from '@/api/xpay/merchantAddress';
import { getPendingCollectionBalances } from '@/api/xpay/userAddress';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ethers } from 'ethers';
import {TronWeb} from 'tronweb';
// import { Google2fa, Verify2faForm, Verify2faSuccess } from '@/api/xpay/merchant/types';

export default {
  components: {
    Money,
    Connection,
    Document,
    CopyDocument,
    DataAnalysis,
    Histogram,
    View,
    Hide,
    Edit,
    Download,
    InfoFilled,
    QrcodeVue
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const isMerchant = ref(false);
    const merchant = ref({});

    const truncateDecimal = (num, digits) => {
      const factor = 10 ** digits;
      return Math.trunc(num  * factor) / factor;
    }
    
    // 检查用户是否是商户
    const checkIsMerchant = async() => {
      // 检查用户角色是否包含商户角色
      const userRoles = userStore.roles;
      if (userRoles.includes('merchant')) {
        isMerchant.value = true;

        const { data } = await merchantInfo();
        merchant.value = data
        apiInfo.callbackUrl = data.callbackUrl;
        apiInfo.ipWhitelist = data.whiteListIp.split(',');
        
        // 只有当用户是商户时才执行这些方法
        checkGoogleAuthBinding();
        loadWalletAddresses();
        loadEnergyPlatformInfo();
        
        // 设置每分钟自动刷新一次钱包地址和余额
        refreshTimer = setInterval(() => {
          console.log('自动刷新钱包地址和余额...');
          loadWalletAddresses();
        }, 60000 * 5); // 60000毫秒 = 1分钟
      } else {
        // 如果不是商户，跳转到其他页面
        // ElMessage({
        //   message: '您不是商户，无法访问商户后台',
        //   type: 'warning'
        // });
        // router.push('/dashboard');
      }
    };
    
    // Google Authenticator binding status
    const isGoogleAuthBound = ref(false);
    const googleBindingDialogVisible = ref(false);
    const googleBindingStep = ref(0);
    const googleBindingFormRef = ref(null);
    const googleAuthSecretKey = ref(''); // Example secret key, should be generated on server
    const googleAuthSecret = ref('');
    
    const googleBindingForm = reactive({
      verificationCode: ''
    });
    
    const googleBindingRules = {
      verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '验证码必须为6位数字', trigger: 'blur' },
        { pattern: /^[0-9]{6}$/, message: '验证码只能包含数字', trigger: 'blur' }
      ]
    };
    
    // 获取ETH链上的余额
    const getEthBalance = async (address, provider) => {
      try {
        if(!address) return 0;
        const balance = await provider.getBalance(address);
        return parseFloat(ethers.formatEther(balance));
      } catch (error) {
        console.error('获取ETH余额失败:', error);
        return 0;
      }
    };
    
    // 获取ERC20代币余额
    const getErc20Balance = async (tokenAddress, walletAddress, provider) => {
      try {
        if(!walletAddress) return 0;
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
        const decimals = await tokenContract.decimals();
        const balance = await tokenContract.balanceOf(walletAddress);
        return parseFloat(ethers.formatUnits(balance, decimals));
      } catch (error) {
        console.error('获取ERC20余额失败:', error);
        return 0;
      }
    };
    
    // 获取TRON链上的余额
    const getTronBalance = async (address) => {
      try {
        if(!address) return 0;
        const tronWeb = new TronWeb({
          fullHost: rpcUrls.value.tron
        });
        const balance = await tronWeb.trx.getBalance(address);
        return parseFloat(ethers.formatUnits(balance.toString(), 6)); // TRX的精度是6
      } catch (error) {
        console.error('获取TRX余额失败:', error);
        return 0;
      }
    };
    
    // 获取TRON链上的USDT余额
    const getTronUsdtBalance = async (address) => {
      try {
        if(!address) return 0;
        const tronWeb = new TronWeb({
          fullHost: rpcUrls.value.tron
        });
        const contract = await tronWeb.contract().at(usdtContracts.value.tron);
        const balance = await contract.balanceOf(address).call({
          from: address, // 必须设置 owner_address 
        });
        return parseFloat(ethers.formatUnits(balance.toString(), 6)); // USDT的精度是6
      } catch (error) {
        console.error('获取TRON USDT余额失败:', error);
        return 0;
      }
    };
    
    // 更新钱包余额
    const updateWalletBalances = async () => {
      try {
        // 创建以太坊和BSC的提供者
        const ethProvider = new ethers.JsonRpcProvider(rpcUrls.value.eth);
        const bscProvider = new ethers.JsonRpcProvider(rpcUrls.value.bsc);
        // 获取ETH链上的余额
        if (walletAddresses.hot.eth) {
          getEthBalance(walletAddresses.hot.eth, ethProvider).then(balance => {
            balanceData.hot.eth = balance;
          }); 
          getErc20Balance(usdtContracts.value.eth, walletAddresses.hot.eth, ethProvider).then(balance => {
            balanceData.hot.usdt.eth = balance;
          });
          getEthBalance(walletAddresses.cold.eth, ethProvider).then(balance => {
            balanceData.cold.eth = balance;
          });
          getErc20Balance(usdtContracts.value.eth, walletAddresses.cold.eth, ethProvider).then(balance => {
            balanceData.cold.usdt.eth = balance;
          });
        }
        
        // 获取BSC链上的余额
        if (walletAddresses.hot.bsc) {
          getEthBalance(walletAddresses.hot.bsc, bscProvider).then(balance => {
            balanceData.hot.bnb = balance;
          });
          getErc20Balance(usdtContracts.value.bsc, walletAddresses.hot.bsc, bscProvider).then(balance => {
            balanceData.hot.usdt.bsc = balance;
          });
          getEthBalance(walletAddresses.cold.bsc, bscProvider).then(balance => {
            balanceData.cold.bnb = balance;
          });
          getErc20Balance(usdtContracts.value.bsc, walletAddresses.cold.bsc, bscProvider).then(balance => {
            balanceData.cold.usdt.bsc = balance;
          });
        }
        
        // 获取TRON链上的余额
        if (walletAddresses.hot.tron) {
          getTronBalance(walletAddresses.hot.tron).then(balance => {
            balanceData.hot.trx = balance;
          });
          getTronUsdtBalance(walletAddresses.hot.tron).then(balance => {
            balanceData.hot.usdt.tron = balance;
          });
          getTronBalance(walletAddresses.cold.tron).then(balance => {
            balanceData.cold.trx = balance;
          });
          getTronUsdtBalance(walletAddresses.cold.tron).then(balance => {
            balanceData.cold.usdt.tron = balance;
          });
        }
        
        // 获取待归集余额
        getPendingCollectionBalances().then(res => {
          if (res && res.data) {
            // 重置待归集余额
            balanceData.hot.pendingCollection.tronUsdt = 0;
            balanceData.hot.pendingCollection.ethUsdt = 0;
            balanceData.hot.pendingCollection.bscUsdt = 0;
            balanceData.hot.pendingCollection.tronTestUsdt = 0;
            balanceData.hot.pendingCollection.ethSepoliaUsdt = 0;
            balanceData.hot.pendingCollection.bscTestUsdt = 0;
            
            // 处理API返回的数据格式
            res.data.forEach(item => {
              const chainSymbol = item.chainSymbol || '';
              const amount = parseFloat(item.totalAmount || '0');
              
              // 处理主网和测试网的链符号
              if (chainSymbol.includes('TRON')) {
                if (chainSymbol.includes('TESTUSDT')) {
                  balanceData.hot.pendingCollection.tronTestUsdt = amount;
                } else {
                  balanceData.hot.pendingCollection.tronUsdt = amount;
                }
              } else if (chainSymbol.includes('ETH')) {
                if (chainSymbol.includes('SEPOLIAUSDT')) {
                  balanceData.hot.pendingCollection.ethSepoliaUsdt = amount;
                } else {
                  balanceData.hot.pendingCollection.ethUsdt = amount;
                }
              } else if (chainSymbol.includes('BSC')) {
                if (chainSymbol.includes('TESTUSDT')) {
                  balanceData.hot.pendingCollection.bscTestUsdt = amount;
                } else {
                  balanceData.hot.pendingCollection.bscUsdt = amount;
                }
              }
            });
          }
        }).catch(error => {
          console.error('获取待归集余额失败:', error);
        });
        
      } catch (error) {
        console.error('更新钱包余额失败:', error);
        ElMessage({
          message: '获取链上余额失败，请刷新页面重试',
          type: 'warning'
        });
      }
    };
    
    // 自动刷新定时器
    let refreshTimer = null;
    
    // 页面加载时检查用户是否是商户
    onMounted(async() => {
      checkIsMerchant();
      // 初始化屏幕尺寸检测
      checkScreenSize();
      // 监听窗口大小变化
      window.addEventListener('resize', checkScreenSize);
    });
    
    // 组件卸载时清除定时器和事件监听器
    onUnmounted(() => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
      // 移除窗口大小变化监听器
      window.removeEventListener('resize', checkScreenSize);
    });
    
    // 处理网络切换
    const handleNetworkChange = () => {
      // 保存网络选择到localStorage
      localStorage.setItem('xpay-network-mode', isTestnet.value ? 'testnet' : 'mainnet');
      
      ElMessage({
        message: `已切换到${isTestnet.value ? '测试网' : '主网'}`,
        type: 'success'
      });
      
      // 更新充值和提现表单的链选项
      if (isTestnet.value) {
        if (withdrawForm.chain === 'TRON') withdrawForm.chain = 'TRON_TEST';
        else if (withdrawForm.chain === 'ETH') withdrawForm.chain = 'ETH_SEPOLIA';
        else if (withdrawForm.chain === 'BSC') withdrawForm.chain = 'BSC_TEST';
        
        if (rechargeForm.chain === 'TRON') rechargeForm.chain = 'TRON_TEST';
        else if (rechargeForm.chain === 'ETH') rechargeForm.chain = 'ETH_SEPOLIA';
        else if (rechargeForm.chain === 'BSC') rechargeForm.chain = 'BSC_TEST';
      } else {
        if (withdrawForm.chain === 'TRON_TEST') withdrawForm.chain = 'TRON';
        else if (withdrawForm.chain === 'ETH_SEPOLIA') withdrawForm.chain = 'ETH';
        else if (withdrawForm.chain === 'BSC_TEST') withdrawForm.chain = 'BSC';
        
        if (rechargeForm.chain === 'TRON_TEST') rechargeForm.chain = 'TRON';
        else if (rechargeForm.chain === 'ETH_SEPOLIA') rechargeForm.chain = 'ETH';
        else if (rechargeForm.chain === 'BSC_TEST') rechargeForm.chain = 'BSC';
      }
      
      // 重新加载钱包地址和余额
      loadWalletAddresses();
    };
    
    // 加载钱包地址
    const loadWalletAddresses = () => {
      // 重置钱包地址
      walletAddresses.hot.tron = '';
      walletAddresses.hot.eth = '';
      walletAddresses.hot.bsc = '';
      walletAddresses.cold.tron = '';
      walletAddresses.cold.eth = '';
      walletAddresses.cold.bsc = '';
      
      // 获取钱包地址列表
      myAddressList().then(res => {
        if (res.data && res.data.length > 0) {
          // 处理钱包地址数据
          res.data.forEach(item => {
            const chain = item.chain.toLowerCase();
            const symbol = item.symbol.toLowerCase();
            
            // 根据当前网络类型过滤地址
            const isCurrentNetworkAddress = isTestnet.value ? 
              (chain.includes('test') || chain.includes('sepolia')) : 
              (!chain.includes('test') && !chain.includes('sepolia'));
            
            if (!isCurrentNetworkAddress) return;
            
            // 根据链类型和符号设置地址
            if (chain.includes('tron')) {
              if (symbol === 'usdt' || symbol === 'trx') {
                walletAddresses.hot.tron = item.hotAddress;
                walletAddresses.cold.tron = item.coldAddress;
              }
            } else if (chain.includes('eth')) {
              if (symbol === 'usdt' || symbol === 'eth') {
                walletAddresses.hot.eth = item.hotAddress;
                walletAddresses.cold.eth = item.coldAddress;
              }
            } else if (chain.includes('bsc')) {
              if (symbol === 'usdt' || symbol === 'bnb') {
                walletAddresses.hot.bsc = item.hotAddress;
                walletAddresses.cold.bsc = item.coldAddress;
              }
            }
          });
          
          // 获取链上余额
          updateWalletBalances();
        }
      }).catch(error => {
        console.error('获取钱包地址失败:', error);
        ElMessage({
          message: '获取钱包地址失败，请刷新页面重试',
          type: 'error'
        });
      });
    };
    
    // 检查谷歌验证器是否已绑定
    const checkGoogleAuthBinding = async() => {
      isGoogleAuthBound.value = merchant.value.googleStatus === 'UNBOUND' ? false : true;
        
      if (!isGoogleAuthBound.value) {
        googleBindingDialogVisible.value = true;
        const {data:{secretKey, qrCodeUrl}} = await bind2fa();
        googleAuthSecretKey.value = secretKey;
        googleAuthSecret.value = qrCodeUrl;
      }

    };
    
    // 验证并绑定谷歌验证器
    const verifyAndBindGoogleAuth = async() => {
      if (!googleBindingFormRef.value) return;
      
      googleBindingFormRef.value.validate(async(valid) => {
        if (valid) {
          const {data:{verify}} = await verify2fa({code:googleBindingForm.verificationCode});
          if (verify) {
            isGoogleAuthBound.value = true;
            googleBindingDialogVisible.value = false;
            
            ElMessage({
              message: '谷歌验证器绑定成功',
              type: 'success'
            });
          }else{
            ElMessage({
              message: '谷歌验证码错误',
              type: 'error'
            });
          }

        }
      });
    };
    // 网络切换 - 从localStorage读取保存的设置，默认为主网
    const isTestnet = ref(localStorage.getItem('xpay-network-mode') === 'testnet');
    
    // 钱包标签页
    const walletTab = ref('hot');
    
    // 钱包地址
    const walletAddresses = reactive({
      hot: {
        tron: '',
        eth: '',
        bsc: ''
      },
      cold: {
        tron: '',
        eth: '',
        bsc: ''
      }
    });
    
    // USDT合约地址 - 主网
    const mainnetContracts = {
      eth: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // ETH主网USDT合约
      bsc: '0x55d398326f99059fF775485246999027B3197955', // BSC主网USDT合约
      tron: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' // TRON主网USDT合约
    };
    
    // USDT合约地址 - 测试网
    const testnetContracts = {
      eth: '0x40701a30271a68cd6f1e31304e10ccd9ab92ebbb', // Sepolia测试网USDT合约
      bsc: '0x1D136Cd361e802e4Ea5785573D076d14fDE3f6e1', // BSC测试网USDT合约
      tron: 'TCfHDHMB3k5Ww9tcWkJQoUFFgDx8aQq6om' // Shasta测试网USDT合约
    };
    
    // 当前使用的合约地址
    const usdtContracts = computed(() => {
      return isTestnet.value ? testnetContracts : mainnetContracts;
    });
    
    // 区块链RPC节点 - 主网
    const mainnetRpcUrls = {
      eth: 'https://eth.llamarpc.com',
      bsc: 'https://binance.llamarpc.com',
      tron: 'https://api.trongrid.io'
    };
    
    // 区块链RPC节点 - 测试网
    const testnetRpcUrls = {
      eth: 'https://eth-sepolia.public.blastapi.io', // Sepolia测试网
      bsc: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545', // BSC测试网
      tron: 'https://api.shasta.trongrid.io' // Shasta测试网
    };
    
    // 当前使用的RPC节点
    const rpcUrls = computed(() => {
      return isTestnet.value ? testnetRpcUrls : mainnetRpcUrls;
    });
    
    // ABI for ERC20 token (USDT)
    const erc20Abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];

    const trc20Abi = [
      {
        'outputs': [{ 'type': 'uint256' }],
        'constant': true,
        'inputs': [{ 'name': 'who', 'type': 'address' }],
        'name': 'balanceOf',
        'stateMutability': 'View',
        'type': 'Function'
      },
      {
        'outputs': [{ 'type': 'bool' }],
        'inputs': [
          { 'name': '_to', 'type': 'address' },
          { 'name': '_value', 'type': 'uint256' }
        ],
        'name': 'transfer',
        'stateMutability': 'Nonpayable',
        'type': 'Function'
      }
    ];


    
    // 余额数据
    const balanceData = reactive({
      hot: {
        usdt: {
          tron: 0,
          eth: 0,
          bsc: 0
        },
        pendingCollection: {
          tronUsdt: 0,
          ethUsdt: 0,
          bscUsdt: 0,
          tronTestUsdt: 0,
          ethSepoliaUsdt: 0,
          bscTestUsdt: 0
        },
        eth: 0,
        trx: 0,
        bnb: 0
      },
      cold: {
        usdt: {
          tron: 0,
          eth: 0,
          bsc: 0
        },
        eth: 0,
        trx: 0,
        bnb: 0
      }
    });

    // API信息
    const apiInfo = reactive({
      token: '',
      secret: '',
      callbackUrl: 'https://your-callback-url.com',
      tokenVisible: false,
      secretVisible: false,
      ipWhitelist: []
    });

    // 今日统计数据
    const todayStats = reactive({
      incomingCount: 50,
      incomingRate: '98%',
      outgoingCount: 30,
      outgoingRate: '95%'
    });

    // 全部统计数据
    const allStats = reactive({
      incomingCount: 1000,
      incomingRate: '97%',
      outgoingCount: 800,
      outgoingRate: '96%'
    });

    // 详细数据
    const todayIncomingData = [
      { currency: 'USDT', chain: 'TRON', amount: 500.00, count: 20 },
      { currency: 'USDT', chain: 'ETH', amount: 300.00, count: 15 },
      { currency: 'USDT', chain: 'BSC', amount: 200.00, count: 10 },
      { currency: 'ETH', chain: 'ETH', amount: 10.00, count: 3 },
      { currency: 'TRX', chain: 'TRON', amount: 1000.00, count: 2 }
    ];

    const todayOutgoingData = [
      { currency: 'USDT', chain: 'TRON', amount: 300.00, count: 12 },
      { currency: 'USDT', chain: 'ETH', amount: 200.00, count: 10 },
      { currency: 'USDT', chain: 'BSC', amount: 100.00, count: 5 },
      { currency: 'ETH', chain: 'ETH', amount: 5.00, count: 2 },
      { currency: 'TRX', chain: 'TRON', amount: 500.00, count: 1 }
    ];

    const allIncomingData = [
      { currency: 'USDT', chain: 'TRON', amount: 10000.00, count: 400 },
      { currency: 'USDT', chain: 'ETH', amount: 6000.00, count: 300 },
      { currency: 'USDT', chain: 'BSC', amount: 4000.00, count: 200 },
      { currency: 'ETH', chain: 'ETH', amount: 200.00, count: 60 },
      { currency: 'TRX', chain: 'TRON', amount: 20000.00, count: 40 }
    ];

    const allOutgoingData = [
      { currency: 'USDT', chain: 'TRON', amount: 8000.00, count: 320 },
      { currency: 'USDT', chain: 'ETH', amount: 5000.00, count: 250 },
      { currency: 'USDT', chain: 'BSC', amount: 3000.00, count: 150 },
      { currency: 'ETH', chain: 'ETH', amount: 150.00, count: 50 },
      { currency: 'TRX', chain: 'TRON', amount: 15000.00, count: 30 }
    ];

    // 标签页状态
    const activeTab = ref('today');
    const detailType = ref('incoming');
    const detailPeriod = ref('today');

    // 充值对话框
    const rechargeDialogVisible = ref(false);
    const rechargeForm = reactive({
      currency: 'USDT',
      chain: 'TRON'
    });

    // 提现对话框
    const withdrawDialogVisible = ref(false);
    const withdrawFormRef = ref(null);
    const withdrawForm = reactive({
      currency: 'USDT',
      chain: 'TRON',
      address: '',
      amount: 0,
      googleCode: ''
    });

    // 提现表单验证规则
    const withdrawRules = {
      currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
      chain: [{ required: true, message: '请选择链', trigger: 'change' }],
      amount: [
        { required: true, message: '请输入提现数量', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            const minAmount = getMinWithdrawAmount();
            if (value < minAmount) {
              callback(new Error(`提现数量不能小于${minAmount}`));
            } else if (value > maxWithdrawAmount.value) {
              callback(new Error(`提现数量不能大于${maxWithdrawAmount.value}`));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ],
      googleCode: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };

    // 谷歌验证对话框
    const googleVerifyDialogVisible = ref(false);
    const googleVerifyFormRef = ref(null);
    const googleVerifyForm = reactive({
      code: '',
      action: '', // 'showToken', 'showSecret', 'editColdWallet'
      data: null // 用于存储额外数据，如编辑冷钱包时的链类型
    });

    // 谷歌验证表单验证规则
    const googleVerifyRules = {
      code: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };

    // 修改回调地址对话框
    const editCallbackDialogVisible = ref(false);
    const editCallbackFormRef = ref(null);
    const editCallbackForm = reactive({
      url: '',
      googleCode: ''
    });
    
    // 修改冷钱包地址对话框
    const editColdWalletDialogVisible = ref(false);
    const editColdWalletFormRef = ref(null);
    const editColdWalletForm = reactive({
      chain: '',
      address: '',
      googleCode: ''
    });
    
    // IP白名单对话框
    const addIpDialogVisible = ref(false);
    const addIpFormRef = ref(null);
    const addIpForm = reactive({
      ipList: '',
      googleCode: ''
    });
    
    // IP白名单表单验证规则
    const addIpRules = {
      ipList: [
        { required: true, message: '请输入IP地址', trigger: 'blur' }
      ],
      googleCode: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };
    
    // 用户充值测试对话框
    const userRechargeTestDialogVisible = ref(false);
    const userRechargeTestForm = reactive({
      currency: 'USDT',
      chain: 'TRON',
      amount: 0.01
    });
    
    // 打开用户充值测试对话框
    const openUserRechargeTestDialog = () => {
      userRechargeTestDialogVisible.value = true;
      // 根据当前网络设置默认链
      if (isTestnet.value) {
        userRechargeTestForm.chain = 'TRON_TEST';
      } else {
        userRechargeTestForm.chain = 'TRON';
      }
    };
    
    // 跳转到用户充值测试页面
    const goToUserRechargeTest = () => {
      // 检查用户ID是否已填写
      if (!userRechargeTestForm.uid) {
        ElMessage({
          message: '请输入用户ID',
          type: 'warning'
        });
        return;
      }
      
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('currency', userRechargeTestForm.currency);
      
      if (userRechargeTestForm.currency === 'USDT') {
        queryParams.append('chain', userRechargeTestForm.chain);
      } else {
        // 对于非USDT币种，根据币种设置对应的链
        const chainMap = {
          'ETH': isTestnet.value ? 'ETH_SEPOLIA' : 'ETH',
          'TRX': isTestnet.value ? 'TRON_TEST' : 'TRON',
          'BNB': isTestnet.value ? 'BSC_TEST' : 'BSC'
        };
        queryParams.append('chain', chainMap[userRechargeTestForm.currency]);
      }
      
      queryParams.append('amount', userRechargeTestForm.amount.toString());
      queryParams.append('uid', userRechargeTestForm.uid);
      
      // 关闭对话框
      userRechargeTestDialogVisible.value = false;
      
      // 在新窗口打开充值测试页面
      window.open(`/user-recharge?${queryParams.toString()}`, '_blank');
    };
    
    // 修改冷钱包地址表单验证规则
    const editColdWalletRules = {
      address: [
        { required: true, message: '请输入钱包地址', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            const chain = editColdWalletForm.chain;
            if (chain === 'tron' && !value.startsWith('T')) {
              callback(new Error('TRON地址必须以T开头'));
            } else if ((chain === 'eth' || chain === 'bsc') && !value.startsWith('0x')) {
              callback(new Error('ETH/BSC地址必须以0x开头'));
            } else {
              callback();
            }
          }, 
          trigger: 'blur' 
        }
      ],
      googleCode: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };

    // 修改回调地址表单验证规则
    const editCallbackRules = {
      url: [
        { required: true, message: '请输入回调地址', trigger: 'blur' },
        { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
      ],
      googleCode: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };

    // 获取详细数据
    const getDetailData = () => {
      if (detailPeriod.value === 'today') {
        return detailType.value === 'incoming' ? todayIncomingData : todayOutgoingData;
      } else {
        return detailType.value === 'incoming' ? allIncomingData : allOutgoingData;
      }
    };

    // 打开充值对话框
    const openRechargeDialog = () => {
      // 根据当前网络设置默认链
      if (isTestnet.value && rechargeForm.currency === 'USDT') {
        if (rechargeForm.chain === 'TRON') rechargeForm.chain = 'TRON_TEST';
        else if (rechargeForm.chain === 'ETH') rechargeForm.chain = 'ETH_SEPOLIA';
        else if (rechargeForm.chain === 'BSC') rechargeForm.chain = 'BSC_TEST';
      }
      
      rechargeDialogVisible.value = true;
    };

    // 打开提现对话框
    const openWithdrawDialog = () => {
      // 根据当前网络设置默认链
      if (isTestnet.value && withdrawForm.currency === 'USDT') {
        if (withdrawForm.chain === 'TRON') withdrawForm.chain = 'TRON_TEST';
        else if (withdrawForm.chain === 'ETH') withdrawForm.chain = 'ETH_SEPOLIA';
        else if (withdrawForm.chain === 'BSC') withdrawForm.chain = 'BSC_TEST';
      }
      
      withdrawDialogVisible.value = true;
      // 计算初始最大可提现金额
      calculateMaxWithdrawAmount();
    };
    
    // 获取最小提币数量
    const getMinWithdrawAmount = () => {
      const currency = withdrawForm.currency;
      
      // 根据不同币种返回最小提币数量
      switch(currency) {
        case 'USDT':
          return 10;
        case 'TRX':
          return 50;
        case 'ETH':
          return 0.002;
        case 'BNB':
          return 0.01;
        default:
          return 0.01;
      }
    };
    
    // 监听提现表单变化，重新计算最大可提现金额
    watch(
      [() => withdrawForm.currency, () => withdrawForm.chain],
      () => {
        calculateMaxWithdrawAmount();
        // console.log(withdrawForm.amount);
        withdrawForm.amount = getMinWithdrawAmount();
        // // 如果当前金额小于最小提币数量，则设置为最小提币数量
        // if (withdrawForm.amount < getMinWithdrawAmount()) {
        //   withdrawForm.amount = getMinWithdrawAmount();
        // }
        // // 如果当前金额大于最大可提现金额，则设置为最大可提现金额
        // else if (withdrawForm.amount > maxWithdrawAmount.value && maxWithdrawAmount.value > getMinWithdrawAmount()) {
        //   withdrawForm.amount = maxWithdrawAmount.value;
        // }
      }
    );

    // 获取充值地址
    const getRechargeAddress = () => {
      // 使用热钱包地址作为充值地址
      let chain = '';
      
      if (rechargeForm.currency === 'USDT') {
        // 处理USDT的链选择，需要标准化测试网和主网的链名称
        const chainLower = rechargeForm.chain.toLowerCase();
        if (chainLower.includes('tron')) {
          chain = 'tron';
        } else if (chainLower.includes('eth')) {
          chain = 'eth';
        } else if (chainLower.includes('bsc')) {
          chain = 'bsc';
        }
      } else {
        // 处理原生代币
        chain = rechargeForm.currency === 'ETH' ? 'eth' : 
                rechargeForm.currency === 'TRX' ? 'tron' : 'bsc';
      }
      
      return walletAddresses.hot[chain] || '';
    };
    
    // 获取提现地址（冷钱包地址）
    const getWithdrawAddress = () => {
      // 使用冷钱包地址作为提现地址
      let chain = '';
      
      if (withdrawForm.currency === 'USDT') {
        // 处理USDT的链选择，需要标准化测试网和主网的链名称
        const chainLower = withdrawForm.chain.toLowerCase();
        if (chainLower.includes('tron')) {
          chain = 'tron';
        } else if (chainLower.includes('eth')) {
          chain = 'eth';
        } else if (chainLower.includes('bsc')) {
          chain = 'bsc';
        }
      } else {
        // 处理原生代币
        chain = withdrawForm.currency === 'ETH' ? 'eth' : 
                withdrawForm.currency === 'TRX' ? 'tron' : 'bsc';
      }
      
      return walletAddresses.cold[chain] || '';
    };
    
    // 最大可提现金额
    const maxWithdrawAmount = ref(0);

    // TRON能量租赁相关
    const energyPlatform = reactive({
      isBound: true,
      trxBalance: 0,
      boundAddress: '',
      rechargeAddress: ''
    });

    const energyBindingStep = ref(0);
    const energyBindingLoading = ref(false);
    const energyBindingFormRef = ref(null);
    const energyBindingForm = reactive({
      apiKey: '',
      googleCode: ''
    });

    const energyBindingRules = {
      apiKey: [
        { required: true, message: '请输入API密钥', trigger: 'blur' }
      ],
      googleCode: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '验证码必须为6位数字', trigger: 'blur' },
        { pattern: /^[0-9]{6}$/, message: '验证码只能包含数字', trigger: 'blur' }
      ]
    };

    // 响应式屏幕尺寸检测
    const isMobile = ref(false);
    
    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768;
    };
    
    // 步骤条方向计算属性
    const stepsDirection = computed(() => {
      return isMobile.value ? 'vertical' : 'horizontal';
    });
    
    // 计算最大可提现金额（扣除gas费和平台手续费）
    const calculateMaxWithdrawAmount = async() => {
      // 获取当前选择的币种和链
      const currency = withdrawForm.currency;
      const chain = currency === 'USDT' ? withdrawForm.chain.toLowerCase() : 
                   currency === 'ETH' ? 'eth' : 
                   currency === 'TRX' ? 'tron' : 'bsc';
      
      // 获取当前余额
      let balance = 0;
      if (currency === 'USDT') {
        // 处理链名称，统一为小写并去除测试网标识
        const normalizedChain = chain.toLowerCase().replace('_test', '').replace('_sepolia', '');
        
        // 使用标准化的链名称获取余额
        if (normalizedChain === 'tron') {
          balance = balanceData.hot.usdt.tron;
        } else if (normalizedChain === 'eth') {
          balance = balanceData.hot.usdt.eth;
        } else if (normalizedChain === 'bsc') {
          balance = balanceData.hot.usdt.bsc;
        }
      } else if (currency === 'ETH') {
        balance = balanceData.hot.eth;
      } else if (currency === 'TRX') {
        balance = balanceData.hot.trx;
      } else if (currency === 'BNB') {
        balance = balanceData.hot.bnb;
      }
      // 计算gas费（根据不同链和币种）
      let gasFee = 0;
      try {
        // 处理链名称，统一为小写并去除测试网标识
        const normalizedChain = chain.toLowerCase().replace('_test', '').replace('_sepolia', '');
        
        if (normalizedChain === 'tron') {
          if (currency === 'USDT') {
            gasFee = 30 * 2; // TRON链USDT转账gas费约30 TRX，还需要加上转手续费的gas
          } else {
            gasFee = 1; // TRX转账gas费约0.5 TRX，还需要加上转手续费的gas
          }
        } else if (normalizedChain === 'eth') {
          const ethProvider = new ethers.JsonRpcProvider(rpcUrls.value.eth);
          const feeData = await ethProvider.getFeeData(); 
          const gasPrice = feeData.gasPrice;  // 也返回传统gasPrice
          // console.log('legacyGasPrice:', legacyGasPrice);
          // const gasPrice = await ethProvider.getGasPrice();  // 获取当前Gas价格（wei）
          if (currency === 'USDT') {
            const gasLimit = 85000;
            gasFee = parseFloat(ethers.formatEther(gasPrice * BigInt(gasLimit))) * 2;
          } else {
            const gasLimit = 21000;
            gasFee = parseFloat(ethers.formatEther(gasPrice * BigInt(gasLimit))) * 2;
          }
        } else if (normalizedChain === 'bsc') {
          const bscProvider = new ethers.JsonRpcProvider(rpcUrls.value.bsc);
          const feeData = await bscProvider.getFeeData(); 
          const gasPrice = feeData.gasPrice;  // 也返回传统gasPrice
          // const gasPrice = await bscProvider.getGasPrice();  // 获取当前Gas价格（wei）
          if (currency === 'USDT') {
            const gasLimit = 85000;
            gasFee = parseFloat(ethers.formatEther(gasPrice * BigInt(gasLimit))) * 2;
          } else {
            const gasLimit = 21000;
            gasFee = parseFloat(ethers.formatEther(gasPrice * BigInt(gasLimit))) * 2;
          }
        }
        // console.log('gasFee:', gasFee);
      } catch (error) {
        console.error('获取gas费失败: 使用默认gas费', error);
        // 使用默认gas费
        if (chain === 'eth') {
          gasFee = currency === 'USDT' ? 0.005 : 0.003;
        } else if (chain === 'bsc') {
          gasFee = currency === 'USDT' ? 0.002 : 0.001;
        }
      }
      
      // 计算平台手续费（百分比）
      const platformFeeRate = (merchant.value?.feeRatio || 0.5) / 100;
      
      // 如果是USDT，直接从余额中扣除平台手续费
      if (currency === 'USDT') {
        const maxAmount = Math.max(balance * (1 - platformFeeRate));
        // console.log('maxAmount:', maxAmount);
        maxWithdrawAmount.value = truncateDecimal(maxAmount, 4);
      } 
      // 如果是原生代币，需要保留足够的代币支付gas费
      else {
        const maxAmount = Math.max((balance - gasFee) * (1 - platformFeeRate));
        // 再扣除平台手续费
        maxWithdrawAmount.value = truncateDecimal(maxAmount, 4);
        // console.log('maxWithdrawAmount:', maxWithdrawAmount.value);
      }
      
      // 确保最终值是有效数字
      // if (isNaN(maxWithdrawAmount.value)) {
      //   maxWithdrawAmount.value = 0;
      // }
    };

    // 复制文本
    const copyText = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        ElMessage({
          message: '复制成功',
          type: 'success'
        });
      }).catch(() => {
        ElMessage({
          message: '复制失败，请手动复制',
          type: 'error'
        });
      });
    };

    // 获取TRON能量平台信息
    const loadEnergyPlatformInfo = async () => {
      try {
        const { data } = await energyPlatformInfo();
        if (data && (data.trxBalance || data.boundAddress || data.rechargeAddress)) {
          energyPlatform.isBound = true;
          energyPlatform.trxBalance = data.trxBalance || 0;
          energyPlatform.boundAddress = data.boundAddress || '';
          energyPlatform.rechargeAddress = data.rechargeAddress || '';
          energyBindingStep.value = 3; // 已完成绑定
        } else {
          energyPlatform.isBound = false;
          energyBindingStep.value = 0;
        }
      } catch (error) {
        console.error('获取能量平台信息失败:', error);
        energyPlatform.isBound = false;
        energyBindingStep.value = 0;
      }
    };

    // 刷新能量平台信息
    const refreshEnergyInfo = async () => {
      await loadEnergyPlatformInfo();
      ElMessage({
        message: '信息已刷新',
        type: 'success'
      });
    };

    // 绑定能量平台
    const bindEnergyPlatform = async () => {
      if (!energyBindingFormRef.value) return;
      
      const valid = await energyBindingFormRef.value.validate().catch(() => false);
      if (!valid) return;

      energyBindingLoading.value = true;
      try {
        await setEnergyApikey({
          apiKey: energyBindingForm.apiKey,
          code: parseInt(energyBindingForm.googleCode)
        });
        
        ElMessage({
          message: 'TRON能量租赁绑定成功',
          type: 'success'
        });
        
        // 重置表单
        resetEnergyBindingForm();
        
        // 重新加载能量平台信息
        await loadEnergyPlatformInfo();
        
      } catch (error) {
        // ElMessage({
        //   message: error.message || '绑定失败，请检查API密钥和验证码',
        //   type: 'error'
        // });
      } finally {
        energyBindingLoading.value = false;
      }
    };

    // 重置能量绑定表单
    const resetEnergyBindingForm = () => {
      energyBindingForm.apiKey = '';
      energyBindingForm.googleCode = '';
      if (energyBindingFormRef.value) {
        energyBindingFormRef.value.resetFields();
      }
    };

    // 显示API值（仅第一次需要谷歌验证）
    const showApiValue = (type) => {
      // 如果是token且已经获取过
      if (type === 'token') {
        if (apiInfo.token) {
          apiInfo.tokenVisible = true;
          return;
        }
      }
      
      // 如果是secret且已经获取过
      if (type === 'secret') {
        if (apiInfo.secret) {
          apiInfo.secretVisible = true;
          return;
        }
      }
      
      // 如果还没有获取过API信息，需要谷歌验证
      googleVerifyForm.action = type === 'token' ? 'showToken' : 'showSecret';
      googleVerifyDialogVisible.value = true;
    };

    // 隐藏API值
    const hideApiValue = (type) => {
      if (type === 'token') {
        apiInfo.tokenVisible = false;
      } else {
        apiInfo.secretVisible = false;
      }
    };

    // 编辑回调地址
    const editCallbackUrl = () => {
      editCallbackForm.url = apiInfo.callbackUrl;
      editCallbackDialogVisible.value = true;
    };

    // 编辑冷钱包地址
    const editColdWalletAddress = (chain) => {
      editColdWalletForm.chain = chain;
      editColdWalletForm.address = walletAddresses.cold[chain];
      editColdWalletForm.googleCode = '';
      editColdWalletDialogVisible.value = true;
    };
    
    // 提交修改冷钱包地址
    const submitEditColdWallet = async() => {
      if (!editColdWalletFormRef.value) return;
      
      editColdWalletFormRef.value.validate(async(valid) => {
        if (valid) {
          const res = await updateColdAddress({chain:editColdWalletForm.chain.toUpperCase(), coldAddress:editColdWalletForm.address, code:editColdWalletForm.googleCode});
          if (res && res.code === 200) {
            walletAddresses.cold[editColdWalletForm.chain] = editColdWalletForm.address;
            ElMessage({
              message: '冷钱包地址修改成功',
              type: 'success'
            });
            editColdWalletDialogVisible.value = false;
          }
          
        }
      });
    };
    
    // 打开添加IP白名单对话框
    const openAddIpDialog = () => {
      addIpForm.ipList = apiInfo.ipWhitelist.join('\n');
      addIpForm.googleCode = '';
      addIpDialogVisible.value = true;
    };
    
    // 提交添加IP白名单
    const submitAddIp = async() => {
      if (!addIpFormRef.value) return;
      
      addIpFormRef.value.validate(async(valid) => {
        if (valid) {
          // 将输入的IP地址按行分割
          const ipList = addIpForm.ipList.split('\n').filter(ip => ip.trim() !== '');
          
          // 验证IP格式 (支持IPv4和IPv6)
          const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
          const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1}:([0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){2}:([0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){3}:([0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){4}:([0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4}:){0,1}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){6}:[0-9a-fA-F]{1,4})$/;
          const invalidIps = ipList.filter(ip => !ipv4Regex.test(ip.trim()) && !ipv6Regex.test(ip.trim()));
          
          if (invalidIps.length > 0) {
            ElMessage({
              message: `以下IP地址格式不正确: ${invalidIps.join(', ')}`,
              type: 'error'
            });
            return;
          }
          
          // 检查是否超过最大数量限制
          if (ipList.length > 10) {
            ElMessage({
              message: `IP白名单最多只能添加10个IP地址`,
              type: 'error'
            });
            return;
          }
          
          // // 检查是否有重复IP
          // const duplicateIps = ipList.filter(ip => apiInfo.ipWhitelist.includes(ip.trim()));
          // if (duplicateIps.length > 0) {
          //   ElMessage({
          //     message: `以下IP地址已存在: ${duplicateIps.join(', ')}，移除重复IP`,
          //     type: 'warning'
          //   });
          //   return;
          // }
          
          const res = await setWhitelistIp({ips:ipList, code:addIpForm.googleCode});
          if(res && res.code === 200) {
            ElMessage({
              message: `成功添加${ipList.length}个IP地址到白名单`,
              type: 'success'
            });
            apiInfo.ipWhitelist = ipList;
            addIpDialogVisible.value = false;
            return;
          }
        }
      });
    };
    
    // 提交谷歌验证
    const submitGoogleVerify = async() => {

      if (!googleVerifyFormRef.value) return;
      
      googleVerifyFormRef.value.validate(async(valid) => {
        if (valid) {
          if (googleVerifyForm.action === 'showToken') {
            if(!apiInfo.token){
              const res = await merchantApiKey({code:googleVerifyForm.code});
              if (res && res.data) {
                  apiInfo.token = res.data.apiKey;
                  apiInfo.secret = res.data.webhookSecret;
              }
            }
            apiInfo.tokenVisible = true;
            
          } else if (googleVerifyForm.action === 'showSecret') {
            if(!apiInfo.secret){
              const res = await merchantApiKey({code:googleVerifyForm.code});
              if (res && res.data) {
                  apiInfo.token = res.data.apiKey;
                  apiInfo.secret = res.data.webhookSecret;
              }
            }
            apiInfo.secretVisible = true;
          } else if (googleVerifyForm.action === 'editColdWallet') {
            // 验证成功后打开编辑冷钱包地址对话框
            const chain = googleVerifyForm.data;
            editColdWalletForm.chain = chain;
            editColdWalletForm.address = walletAddresses.cold[chain];
            editColdWalletForm.googleCode = googleVerifyForm.code;
            editColdWalletDialogVisible.value = true;
          }
          
        
          googleVerifyDialogVisible.value = false;
          googleVerifyForm.code = '';
        }
      });
    };

    // 提交修改回调地址
    const submitEditCallback = async() => {
      if (!editCallbackFormRef.value) return;
      
      editCallbackFormRef.value.validate(async(valid) => {
        if (valid) {
          const res = await updateCallbackUrl({callbackUrl:editCallbackForm.url, code:editCallbackForm.googleCode});
          if(res && res.code === 200) {
            apiInfo.callbackUrl = editCallbackForm.url;
            ElMessage({
              message: '回调地址修改成功',
              type: 'success'
            });
            editCallbackDialogVisible.value = false;
            editCallbackForm.googleCode = '';
          }
          
        }
      });
    };

    // 提交提现
    const submitWithdraw = async() => {
      if (!withdrawFormRef.value) return;
      
      // 先检查提现金额是否在有效范围内
      const minAmount = getMinWithdrawAmount();
      if (withdrawForm.amount < minAmount) {
        ElMessage({
          message: `提现数量不能小于${minAmount}`,
          type: 'error'
        });
        return;
      }
      
      if (withdrawForm.amount > maxWithdrawAmount.value || maxWithdrawAmount.value < minAmount) {
        ElMessage({
          message: `提现数量不能大于${maxWithdrawAmount.value}`,
          type: 'error'
        });
        return;
      }
      
      withdrawFormRef.value.validate(async(valid) => {
        if (valid) {
          const withdrawAddress = getWithdrawAddress();
          if(!withdrawAddress) {
            ElMessage({
              message: `请先设置提现地址`,
              type: 'error'
            });
            return;
          }
          
          ElMessageBox.confirm(
            `确认提现 ${withdrawForm.amount} ${withdrawForm.currency} 到地址 ${withdrawAddress}?`,
            '提现确认',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
            }
          ).then(async() => {
            const res = await withdrawal({chain:withdrawForm.chain, address:withdrawAddress, amount:withdrawForm.amount, symbol:withdrawForm.currency, code:withdrawForm.googleCode});
            if(res && res.code === 200) {
              ElMessage({
                message: '提现申请已提交，请等待处理',
                type: 'success'
              });
              withdrawDialogVisible.value = false;
            }else{
              ElMessage({
                message: '提现申请失败',
                type: 'error'
              });
            }
          }).catch(() => {
            // 用户取消提现
          });
        }
      });
    };

    return {
      isMerchant,
      merchant, // Added merchant ref to the return statement
      // Google Authenticator binding
      isGoogleAuthBound,
      googleBindingDialogVisible,
      googleBindingStep,
      googleBindingFormRef,
      googleAuthSecret,
      googleAuthSecretKey,
      googleBindingForm,
      googleBindingRules,
      verifyAndBindGoogleAuth,
      walletTab,
      walletAddresses,
      balanceData,
      apiInfo,
      todayStats,
      allStats,
      activeTab,
      detailType,
      detailPeriod,
      rechargeDialogVisible,
      rechargeForm,
      withdrawDialogVisible,
      withdrawForm,
      withdrawRules,
      withdrawFormRef,
      googleVerifyDialogVisible,
      googleVerifyForm,
      googleVerifyRules,
      googleVerifyFormRef,
      editCallbackDialogVisible,
      editCallbackForm,
      editCallbackRules,
      editCallbackFormRef,
      editColdWalletDialogVisible,
      editColdWalletForm,
      editColdWalletRules,
      editColdWalletFormRef,
      // User recharge test
      userRechargeTestDialogVisible,
      userRechargeTestForm,
      openUserRechargeTestDialog,
      goToUserRechargeTest,
      getDetailData,
      openRechargeDialog,
      openWithdrawDialog,
      getRechargeAddress,
      getWithdrawAddress,
      maxWithdrawAmount,
      calculateMaxWithdrawAmount,
      getMinWithdrawAmount,
      copyText,
      showApiValue,
      hideApiValue,
      editCallbackUrl,
      editColdWalletAddress,
      submitGoogleVerify,
      submitEditCallback,
      submitEditColdWallet,
      submitWithdraw,
      isTestnet,
      handleNetworkChange,
      truncateDecimal,
      // IP whitelist methods
      addIpDialogVisible,
      addIpForm,
      addIpRules,
      addIpFormRef,
      openAddIpDialog,
      submitAddIp,
      // TRON energy platform
      energyPlatform,
      energyBindingStep,
      energyBindingLoading,
      energyBindingFormRef,
      energyBindingForm,
      energyBindingRules,
      loadEnergyPlatformInfo,
      refreshEnergyInfo,
      bindEnergyPlatform,
      resetEnergyBindingForm,
      // Responsive design
      isMobile,
      stepsDirection
    };
  }
};
</script>

<style scoped>
.merchant-dashboard {
  padding: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.wallet-tabs {
  margin-left: 20px;
}

.balance-card {
  height: 100%;
}

.wallet-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9fafc;
}

.wallet-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #409EFF;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 8px;
}

.balance-amount {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.balance-amount .label {
  color: #606266;
}

.balance-amount .amount {
  font-weight: bold;
  font-size: 16px;
}

.wallet-address {
  margin-top: 15px;
}

.address-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 5px;
}

.address-value {
  margin-bottom: 10px;
}

.balance-actions {
  display: flex;
  justify-content: space-around;
}

.api-info {
  margin-bottom: 20px;
}

.api-value-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.api-actions {
  display: flex;
  gap: 5px;
}

.api-doc-link {
  margin-top: 15px;
  text-align: center;
}

.stats-overview-card {
  height: 100%;
}

.stat-item {
  padding: 10px;
  margin-bottom: 15px;
}

.stat-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-rate {
  font-size: 12px;
  color: #606266;
}

.recharge-address-info {
  padding: 10px;
}

.address-label {
  font-weight: bold;
  margin-bottom: 10px;
}

.address-value {
  margin-bottom: 20px;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.qrcode-image {
  width: 200px;
  height: 200px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  line-height: 1.4;
}

/* Google Authenticator binding styles */
.google-auth-setup {
  padding: 20px 0;
}

.step-content {
  margin-top: 30px;
}

.step-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #409EFF;
}

.app-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.step-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.secret-key {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.verification-input {
  width: 200px;
  margin: 0 auto;
  display: block;
}

/* IP whitelist styles */
.ip-whitelist-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ip-whitelist-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.ip-tag {
  margin-right: 5px;
}

.add-ip-button {
  padding: 5px;
  height: 28px;
}

.ip-whitelist-info {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.ip-input-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

/* TRON能量租赁样式 */
.energy-bound-info {
  padding: 16px;
}

.address-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.energy-bound-info .address-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #606266;
  word-break: break-all;
  flex: 1;
  min-width: 0;
}

.energy-binding-flow {
  padding: 16px;
}

.steps-container {
  margin-bottom: 24px;
}

.energy-steps {
  width: 100%;
}

.binding-content {
  width: 100%;
}

.binding-alert {
  margin-bottom: 16px;
}

.binding-steps-list {
  margin: 8px 0;
  padding-left: 20px;
}

.binding-steps-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.energy-binding-form {
  width: 100%;
  min-width: 300px;
}

.energy-binding-form .el-form-item {
  margin-bottom: 18px;
}

.energy-binding-form .el-form-item__label {
  min-width: 100px;
}

.form-actions {
  margin-top: 16px;
}

.form-actions .el-button {
  margin-right: 12px;
}

.energy-actions {
  text-align: center;
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .energy-bound-info,
  .energy-binding-flow {
    padding: 12px;
  }
  
  .energy-binding-form {
    min-width: 280px;
  }
  
  .energy-binding-form .el-form-item__label {
    min-width: 80px;
  }
  
  .address-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .energy-bound-info .address-text {
    font-size: 11px;
    width: 100%;
  }
  
  .energy-steps {
    font-size: 12px;
  }
  
  .energy-steps .el-step__title {
    font-size: 12px !important;
  }
  
  .energy-steps .el-step__description {
    font-size: 11px !important;
  }
  
  .binding-steps-list {
    padding-left: 16px;
  }
  
  .binding-steps-list li {
    font-size: 13px;
    margin-bottom: 6px;
  }
  
  .energy-binding-form .el-form-item__label {
    font-size: 13px;
  }
  
  .form-actions {
    text-align: center;
  }
  
  .form-actions .el-button {
    margin: 4px;
    width: auto;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .energy-bound-info,
  .energy-binding-flow {
    padding: 8px;
  }
  
  .steps-container {
    margin-bottom: 16px;
  }
  
  .energy-steps {
    font-size: 11px;
  }
  
  .binding-steps-list li {
    font-size: 12px;
  }
  
  .energy-binding-form {
    min-width: 250px;
  }
  
  .energy-binding-form .el-form-item__label {
    min-width: 70px;
  }
  
  .form-actions .el-button {
    width: 100%;
    margin: 4px 0;
  }
}

/* 全局表单宽度修复 */
.el-form {
  min-width: 200px;
}

.el-dialog .el-form {
  width: 100%;
}
</style>
