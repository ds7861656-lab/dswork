import React from 'react';
import { Section, SubSection } from '../../components/policy/Section';

export const TermsOfServiceEU_ZH: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800 text-white p-8 -mx-8 -mt-8 mb-8 rounded-t-2xl">
        <h1 className="text-3xl font-bold mb-2">afreshtrip 软件许可及服务协议 (欧盟版)</h1>
        <p className="opacity-80 text-sm">适用对象：欧盟消费者 | 版本：EU-2025-V1</p>
      </div>

      <Section title="一、协议须知">
        <p className="mb-4">
          感谢您选用afreshtrip软件及相关服务（以下简称"本服务"）。在正式使用之前，恳请您认真阅读并完全理解《afreshtrip软件许可及服务协议》（以下简称"本协议"）及安思达乐公司可能不时发布或修订的相关条款（统称"本用户服务条款"），我们严格遵守欧盟《通用数据保护条例》（以下简称"GDPR"）。我们特别提醒您留意与自身权益和义务紧密相关的条款，该类内容可能以加粗等形式予以标识，尤其包括涉及责任免除或限制的约定。
        </p>
        
        <p className="mb-4">
          在您使用本服务前，请仔细阅读以下条款。您需要主动勾选以下独立选项以表示同意：
        </p>
        
        {/* Consent Checkboxes */}
        <div className="bg-slate-50 border border-slate-200 p-4 my-4 rounded-md">
          <p className="text-sm font-bold text-slate-700 mb-2">在您使用本服务前，请仔细阅读以下条款：</p>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input type="checkbox" disabled checked className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-slate-700"><strong>我仔细阅读了本协议并接受《afreshtrip软件许可及服务协议》</strong></span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" disabled checked className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-slate-700">我同意出于分析和个性化推荐的目的处理我的个人数据</span>
            </label>
          </div>
        </div>
        
        <p className="mb-4">
          <strong>若您是欧盟用户，您必须达到您所在成员国规定的法定年龄（通常为13至16岁）才能独立接受本协议。未达法定年龄的用户，需由父母或监护人代为同意。作为监护人，需由监护人阅读并同意《儿童隐私保护指南》，并通过实名认证完成监护人身份核验后方可使用。监护人可通过</strong><strong>【我的-&gt;设置-&gt;隐私中心-&gt;儿童信息管理】</strong><strong>管理儿童权限。</strong>
        </p>
        
        <p className="mb-4">
          本协议所涉及的许可内容，包括但不限于安思达乐公司向用户提供的afreshtrip软件许可及服务，具体形式可涵盖afreshtrip App、小程序、网页版等多种终端与平台。
        </p>
      </Section>

      <Section title="二、使用规范">
        <SubSection title="2.1 账号管理">
          <p className="mb-4">
            您在使用本服务时可能需要注册账号。您承诺：
          </p>
          <p className="mb-4">
            <strong>提供真实、准确、最新和完整的个人信息进行注册；</strong>及时更新您的个人信息，以保持其真实、准确、最新和完整；对您的账号密码负有保管责任，并对使用该账号进行的所有活动承担责任；如发现任何未经授权使用您账号的情况，应立即通知本公司。
          </p>
        </SubSection>

        <SubSection title="2.2 GDPR合规">
          <p className="mb-4">
            您同意遵循欧盟GDPR及相关法律法规，并同意不得利用本服务从事以下行为：
          </p>
          <p className="mb-4">
            <strong>宣扬恐怖主义、煽动仇恨（基于种族、民族、宗教、性取向等）</strong><strong>或侵犯他人合法权益的内容；侵犯任何人的专利权、商标权、著作权、商业秘密等知识产权或其他专有权利；进行任何可能对本服务的软件、硬件及网络基础设施造成不合理负荷的行为，或尝试干扰、破坏本服务的正常运作；未经授权尝试访问本服务的任何系统、网络或数据；任何其他违反法律法规或公序良俗的行为。</strong>
          </p>
          <p className="mb-4">
            此外，您有权反对基于您个人数据的自动化决策（包括用户画像），并要求进行人工干预。您可通过<strong>【我的-&gt;设置-&gt;隐私中心】</strong>行使此项权利。
          </p>
        </SubSection>

        <SubSection title="2.3 旅游规划特别约定">
          <p className="mb-4">
            鉴于本服务提供旅游路线规划功能，您在使用相关功能时还须同意：
          </p>
          <p className="mb-4">
            您创建或分享的行程不得用于商业目的（除非获得本公司书面许可）。分享任何行程前，您必须确保已获得所有涉及人员的明确同意。将行程分享至欧盟以外地区将构成个人数据的跨境传输，该传输受欧盟法律机制的保护。您应自行核实目的地的最新信息，并自行核实目的地的最新开放状态、签证要求、安全状况等，对自身的旅行决策和安全负全部责任。
          </p>
        </SubSection>
      </Section>

      <Section title="三、知识产权">
        <SubSection title="3.1 安思达乐公司的知识产权">
          <p className="mb-4">
            <strong>安思达乐公司独立享有afreshtrip服务及相关内容的全部知识产权，包括但不限于数据库、源代码、商标及专利等。这些权利受欧盟《数据库法律保护指令》、《版权指令》等相关法律保护。</strong>
          </p>
          <p className="mb-4">
            您通过本服务获取的第三方内容，其权利归对应权利人所有。使用本服务不代表任何知识产权转移。未经书面许可，不得复制、修改、出租或销售相关内容，也不得删除任何权利标记。
          </p>
          <p className="mb-4">
            除另有书面协议外，本协议未授予您使用afreshtrip及相关标志的任何权利。
          </p>
        </SubSection>

        <SubSection title="3.2 您的知识产权与授权">
          <p className="mb-4">
            您通过本平台上传的内容须为您本人创作或已获授权。您承诺不侵犯任何第三方权利，包括知识产权、隐私权等。若未能提供权利证明或收到侵权通知，安思达乐公司有权依据欧盟《数字服务法案》删除或屏蔽相关内容。
          </p>
          <p className="mb-4">
            为提供和改进服务，您授予安思达乐公司全球范围内、免费、非独家的许可，允许我们使用、修改您发布的内容。此项授权在您删除内容时终止。独立商业用途需另行获得同意。
          </p>
          <p className="mb-4">
            关于您的个人数据，您仍享有GDPR规定的全部权利（如访问、更正、删除等），可通过<strong>【我的-&gt;设置-&gt;隐私中心】</strong>行使。具体处理方式受本协议第四章及《隐私政策》约束。
          </p>
        </SubSection>
      </Section>

      <Section title="四、免责声明">
        <SubSection title="4.1 服务与信息责任限制">
          <p className="mb-4">
            <strong>您理解并同意，本服务提供的所有信息（包括地图数据、路线规划等）仅供参考。您应自行核实目的地的最新状况，并对自身的旅行决策和安全负全部责任。根据欧盟法律，对于因本公司重大过失或故意不当行为造成的直接损失，我们将依法承担责任。对于间接损失（如利润或数据丢失），我们的责任总额不超过您过去12个月内支付的总费用或500欧元（以较高者为准）。</strong>
          </p>
        </SubSection>

        <SubSection title="4.2 第三方内容">
          <p className="mb-4">
            本服务包含的第三方链接、广告或内容，其准确性、合法性由第三方自行负责。您与第三方之间的互动，<strong>受该第三方自身的条款和隐私政策约束。</strong>
          </p>
        </SubSection>

        <SubSection title="4.3 数据泄露通知义务">
          <p className="mb-4">
            尽管我们采取了行业标准的安全措施，但无法完全杜绝数据泄露风险。一旦发生可能对您造成风险的泄露事件，我们承诺：
          </p>
          <p className="mb-4">
            <strong>1.在知悉后的72小时内向监管机构报告；</strong>
          </p>
          <p className="mb-4">
            <strong>2.在高风险情况下及时通知您并告知应对措施。</strong>
          </p>
        </SubSection>

        <SubSection title="4.4 不可抗力">
          <p className="mb-4">
            如因不可抗力（包括自然灾害、战争、政府行为、欧盟数据跨境政策突变或大规模网络攻击等）导致服务中断或数据丢失，我们将尽力减少损失，但对此不承担赔偿责任。
          </p>
        </SubSection>
      </Section>

      <Section title="五、服务变更、中断与终止">
        <p className="mb-4">
          5.1您有权随时通过永久删除移动设备上的afreshtrip 应用程序、不再访问我们的网站或停止使用相关服务等方式，终止使用本服务。
        </p>
        <p className="mb-4">
          5.2为确保服务质量和社区环境，在发生以下情况时，<strong>安思达乐公司有权视具体情况采取暂停提供服务、限制部分功能、或永久终止您的账号及服务等一项或多项措施</strong>，<strong>除涉及人身安全、法律合规的紧急情况外，在限制/终止服务前将通过【app消息/短信/邮件】之一告知具体理由及申诉渠道</strong>：
        </p>
        <p className="mb-4">
          您违反本协议中的任何条款、规则或声明；您提供的信息不真实、不合法或不准确；依据法律法规或政府主管部门的要求；出于安全原因或为应对突发网络事件、防止网络攻击的需要；您有欺诈、滥用分享机制、发布违法或不良信息、侵害他人合法权益或其他损害本服务生态的行为。
        </p>
        <p className="mb-4">
          5.3本协议终止后（无论何种原因），安思达乐公司有权立即停止向您提供所有服务。您将无法再通过您的账号访问相关服务、数据或信息；安思达乐公司可根据适用法律和我们的《隐私政策》保留或删除您的数据；本协议中约定本身具有延续效力的条款（如知识产权、免责声明、法律责任、争议解决等）将继续有效，对双方仍具有法律约束力。
        </p>
      </Section>

      <Section title="六、法律责任">
        <SubSection title="6.1 法律适用">
          <p className="mb-4">
            <strong>本协议的订立、效力、解释、履行、修改和终止，均受您作为消费者常住地的欧盟成员国法律管辖。此举旨在遵循欧盟《罗马条例 I》的规定，该条例强制要求消费者合同受消费者惯常居住地国法律管辖。</strong>
          </p>
        </SubSection>

        <SubSection title="6.2 争议解决">
          <p className="mb-4">
            您与安思达乐公司双方同意，因本协议或其执行所产生的任何争议，应首先通过友好协商解决。若协商未能达成一致，我们鼓励您优先使用欧盟委员会官方提供的在线争议解决平台（consumer redressin in the European union）寻求解决方案。该平台网址为：https://consumer-redress.ec.europa.eu/index_en 。您有权将争议提交至您常住地、或安思达乐公司在欧盟的代表机构所在地的成员国法院进行诉讼。
          </p>
        </SubSection>

        <SubSection title="6.3 条款效力">
          <p className="mb-4">
            <strong>若本协议中的任何条款与适用的欧盟数据保护法律（特别是《通用数据保护条例》(GDPR)）发生冲突，应以欧盟法律的规定为准。</strong>若本协议中的任何条款因任何原因被有管辖权的法院或监管机构认定为部分或全部无效或不可执行，该条款的无效或不可执行不影响本协议其他条款的效力，其余条款仍保持完全的效力与执行力。
          </p>
        </SubSection>

        <SubSection title="6.4 权利行使">
          <p className="mb-4">
            安思达乐公司未及时行使本协议项下的任何权利，不应被视为对该权利的放弃。本协议中关于数据保护、知识产权、免责声明、责任限制等条款，在本协议终止后继续有效。
          </p>
        </SubSection>
      </Section>

      <Section title="七、其他">
        <SubSection title="7.1 通知与送达">
          <p className="mb-4">
            本协议项下安思达乐公司向您发出的所有通知、警告或其他信息，均可通过网站公告、电子邮件、手机短信或常规信件传送等方式之一进行。该等通知于发送之日视为已送达收件人。
          </p>
        </SubSection>

        <SubSection title="7.2 协议完整性">
          <p className="mb-4">
            本协议（包括隐私政策及相关附件）构成您与安思达乐公司之间就本服务所达成的完整协议，并取代您与安思达乐公司先前就本服务达成的任何口头或书面协议或理解。
          </p>
        </SubSection>

        <SubSection title="7.3 权利转让">
          <p className="mb-4">
            您不得将本协议项下的任何权利或义务转让给任何第三方。安思达乐公司有权将本协议项下的全部权利和义务转让给其关联公司，或因合并、收购、资产出售等公司重组行为而涉及的第三方，届时我们将通过本服务或其它适当方式通知您。
          </p>
        </SubSection>

        <SubSection title="7.4 条款可分割性">
          <p className="mb-4">
            如本协议中的任何条款因任何原因被有管辖权的法院认定为部分或全部无效或不可执行，则该条款应尽可能按可执行且最能反映原条款意图的方式予以解释，且不影响本协议其他条款的效力。
          </p>
        </SubSection>

        <SubSection title="7.5 语言">
          <p className="mb-4">
            <strong>本协议以中文订立，并仅以中文文本为准。任何其他语言的翻译版本仅供方便参考之用，如与中文文本存在任何冲突，应以中文文本为准。</strong>
          </p>
        </SubSection>
      </Section>
    </div>
  );
};