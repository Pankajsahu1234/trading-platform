import PDFDocument from 'pdfkit';

async function generateTransactionCodePDF(transactionCode, userEmail, userName, phonePassword) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        userPassword: phonePassword,
        ownerPassword: phonePassword,
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
          annotating: false,
        },
        autoFirstPage: false,
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const colors = {
        darkBg: '#070b12',
        cardBg: '#0f1420',
        gold: '#f0c040',
        goldDark: '#c9a227',
        goldDarker: '#7a5500',
        lightText: '#ffffff',
        secondaryText: '#c8d0e0',
        mutedText: '#6b7a9a',
        dimText: '#3a4560',
        border: '#1a2035',
        accentBg: '#0e1520',
        inputBg: '#0a1020',
        inputBorder: '#1e2a40',
      };

      // ── Rounded rectangle helper ───────────────────────────────
      const roundedRect = (x, y, w, h, r) => {
        doc.moveTo(x + r, y)
          .lineTo(x + w - r, y)
          .quadraticCurveTo(x + w, y, x + w, y + r)
          .lineTo(x + w, y + h - r)
          .quadraticCurveTo(x + w, y + h, x + w - r, y + h)
          .lineTo(x + r, y + h)
          .quadraticCurveTo(x, y + h, x, y + h - r)
          .lineTo(x, y + r)
          .quadraticCurveTo(x, y, x + r, y)
          .closePath();
      };

      // ── Page background ────────────────────────────────────────
      const fillBackground = () => {
        doc.save();
        doc.rect(0, 0, doc.page.width, doc.page.height).fill(colors.darkBg);
        doc.restore();
      };

      // ── Overflow guard ─────────────────────────────────────────
      const ensureSpace = (needed) => {
        if (doc.y + needed > doc.page.height - 60) {
          doc.addPage();
          doc.y = 50;
        }
      };

      doc.on('pageAdded', fillBackground);
      doc.addPage();

      const pageW = doc.page.width;
      const margin = 44;
      const contentW = pageW - margin * 2;
      const cardX = margin;
      const cardW = contentW;
      const cardRadius = 18;

      // ════════════════════════════════════════════════════════════
      // PRE-HEADER TEXT
      // ════════════════════════════════════════════════════════════
      doc.fontSize(7.5).font('Helvetica').fillColor(colors.dimText)
        .text('SECURE COMMUNICATION  ·  TIMOFX.COM', margin, 28, {
          width: contentW,
          align: 'center',
          characterSpacing: 2.5,
          lineBreak: false,
        });

      // ════════════════════════════════════════════════════════════
      // MAIN CARD (rounded, bordered)
      // ════════════════════════════════════════════════════════════
      const cardY = 48;
      const cardTotalH = 680;

      // Card shadow
      doc.save();
      roundedRect(cardX - 1, cardY - 1, cardW + 2, cardTotalH + 2, cardRadius + 1);
      doc.fill('#020508');
      doc.restore();

      // Card background
      doc.save();
      roundedRect(cardX, cardY, cardW, cardTotalH, cardRadius);
      doc.fill(colors.cardBg);
      doc.restore();

      // Card border
      doc.save();
      roundedRect(cardX, cardY, cardW, cardTotalH, cardRadius);
      doc.lineWidth(1).stroke(colors.border);
      doc.restore();

      // ════════════════════════════════════════════════════════════
      // HEADER SECTION
      // ════════════════════════════════════════════════════════════
      const headerH = 120;

      doc.save();
      doc.rect(cardX, cardY, cardW, headerH).fill(colors.darkBg);
      doc.restore();

      // Grid lines
      doc.save();
      doc.opacity(0.07);
      doc.strokeColor(colors.gold).lineWidth(0.5);
      for (let gy = cardY; gy < cardY + headerH; gy += 18) {
        doc.moveTo(cardX, gy).lineTo(cardX + cardW, gy).stroke();
      }
      for (let gx = cardX; gx < cardX + cardW; gx += 18) {
        doc.moveTo(gx, cardY).lineTo(gx, cardY + headerH).stroke();
      }
      doc.restore();

      // Logo box — centered
      const logoSize = 40;
      const logoBoxX = pageW / 2 - 70;
      const logoBoxY = cardY + (headerH - logoSize) / 2;
      const logoRadius = 10;

      doc.save();
      roundedRect(logoBoxX, logoBoxY, logoSize, logoSize, logoRadius);
      doc.fill(colors.goldDark);
      doc.restore();

      doc.fontSize(21).font('Helvetica-Bold').fillColor(colors.darkBg)
        .text('T', logoBoxX, logoBoxY + 10, { width: logoSize, align: 'center', lineBreak: false });

      // "TIMO FX" text
      const brandX = logoBoxX + logoSize + 14;
      doc.fontSize(23).font('Helvetica-Bold').fillColor(colors.gold)
        .text('TIMO', brandX, logoBoxY + 5, { lineBreak: false });
      doc.fontSize(23).font('Helvetica-Bold').fillColor(colors.lightText)
        .text(' FX', brandX + 56, logoBoxY + 5, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor('#4a5568')
        .text('INVESTMENT PLATFORM', brandX, logoBoxY + 32, {
          lineBreak: false,
          characterSpacing: 2.5,
        });

      // ── Gold gradient separator line ───────────────────────────
      const sepY = cardY + headerH;
      doc.save();
      const goldGrad = doc.linearGradient(cardX, sepY, cardX + cardW, sepY);
      goldGrad.stop(0, colors.goldDarker)
        .stop(0.25, colors.goldDark)
        .stop(0.5, colors.gold)
        .stop(0.75, colors.goldDark)
        .stop(1, colors.goldDarker);
      doc.rect(cardX, sepY, cardW, 3).fill(goldGrad);
      doc.restore();

      // ════════════════════════════════════════════════════════════
      // BODY CONTENT
      // ════════════════════════════════════════════════════════════
      doc.y = sepY + 36;

      // ── Title ──────────────────────────────────────────────────
      doc.fontSize(28).font('Helvetica-Bold').fillColor(colors.lightText)
        .text('Your Transaction ', margin + 10, doc.y, { continued: true, lineBreak: false });
      doc.fillColor(colors.gold).text('Code', { lineBreak: false });
      doc.y += 42;

      // ── Greeting ───────────────────────────────────────────────
      doc.fontSize(11).font('Helvetica').fillColor(colors.mutedText)
        .text('Hi ', margin + 10, doc.y, { continued: true, lineBreak: false });
      doc.font('Helvetica-Bold').fillColor(colors.secondaryText)
        .text(userName, { continued: true, lineBreak: false });
      doc.font('Helvetica').fillColor(colors.mutedText)
        .text(', this is your unique Transaction Code. ', { continued: true, lineBreak: false });
      doc.font('Helvetica-Bold').fillColor(colors.gold)
        .text('Keep it secure and use it for all withdrawal requests.');
      doc.y += 30;

      // ════════════════════════════════════════════════════════════
      // TRANSACTION CODE BOX
      // ════════════════════════════════════════════════════════════
      ensureSpace(140);
      const codeBoxX = margin + 10;
      const codeBoxW = contentW - 20;
      const codeBoxH = 128;
      const codeBoxY = doc.y;
      const codeBoxR = 14;

      // Box fill
      doc.save();
      roundedRect(codeBoxX, codeBoxY, codeBoxW, codeBoxH, codeBoxR);
      doc.fill(colors.accentBg);
      doc.restore();

      // Box border — FIXED: uses codeBox variables (not noticeBox)
      doc.save();
      roundedRect(codeBoxX, codeBoxY, codeBoxW, codeBoxH, codeBoxR);
      doc.lineWidth(1).stroke(colors.gold + '60');
      doc.restore();

      // Label
      doc.fontSize(8).font('Helvetica').fillColor(colors.dimText)
        .text('TRANSACTION CODE', codeBoxX, codeBoxY + 20, {
          width: codeBoxW,
          align: 'center',
          characterSpacing: 4,
          lineBreak: false,
        });

      // Code
      doc.fontSize(26).font('Helvetica-Bold').fillColor(colors.gold)
        .text(transactionCode, codeBoxX, codeBoxY + 44, {
          width: codeBoxW,
          align: 'center',
          lineBreak: false,
          characterSpacing: 4,
        });

      // Inner divider
      const innerDivY = codeBoxY + 86;
      doc.save();
      const innerGrad = doc.linearGradient(codeBoxX + 80, innerDivY, codeBoxX + codeBoxW - 80, innerDivY);
      innerGrad.stop(0, '#00000000').stop(0.5, colors.gold + '25').stop(1, '#00000000');
      doc.rect(codeBoxX + 80, innerDivY, codeBoxW - 160, 1).fill(innerGrad);
      doc.restore();

      // Pill badge
      const badgeW = 190;
      const badgeH = 22;
      const badgeX = codeBoxX + (codeBoxW - badgeW) / 2;
      const badgeY = codeBoxY + 96;

      doc.save();
      roundedRect(badgeX, badgeY, badgeW, badgeH, 11);
      doc.fill(colors.inputBg);
      doc.restore();

      doc.save();
      roundedRect(badgeX, badgeY, badgeW, badgeH, 11);
      doc.lineWidth(1).stroke(colors.inputBorder);
      doc.restore();

      doc.fontSize(8.5).font('Helvetica').fillColor(colors.mutedText)
        .text('🔒   Required for withdrawals', badgeX, badgeY + 6, {
          width: badgeW,
          align: 'center',
          lineBreak: false,
        });

      doc.y = codeBoxY + codeBoxH + 32;

      // ════════════════════════════════════════════════════════════
      // SECURITY NOTICE BOX
      // ════════════════════════════════════════════════════════════
      ensureSpace(130);
      const noticeBoxX = margin + 10;
      const noticeBoxW = contentW - 20;
      const noticeBoxR = 14;
      const noticeBoxY = doc.y;
      const noticePoints = [
        'Save this PDF securely — you will not see this code again',
        'Never share your transaction code with anyone',
        'We will never ask for your transaction code',
        'Use this code for withdrawal and P2P transactions only',
      ];
      const noticeBoxH = 14 + 22 + noticePoints.length * 18 + 10;

      // Box fill
      doc.save();
      roundedRect(noticeBoxX, noticeBoxY, noticeBoxW, noticeBoxH, noticeBoxR);
      doc.fill(colors.accentBg);
      doc.restore();

      // Box border — FIXED: gold color, not white/green
      doc.save();
      roundedRect(noticeBoxX, noticeBoxY, noticeBoxW, noticeBoxH, noticeBoxR);
      doc.lineWidth(1).stroke(colors.gold + '60');
      doc.restore();

      // Warning icon — gold circle
      const iconCX = noticeBoxX + 28;
      const iconCY = noticeBoxY + 22;
      doc.save();
      doc.circle(iconCX, iconCY, 9).fill(colors.gold + '22');
      doc.restore();
      doc.save();
      doc.circle(iconCX, iconCY, 9).lineWidth(1.2).stroke(colors.gold + '99');
      doc.restore();
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.gold)
        .text('!', iconCX - 3, iconCY - 7.5, { lineBreak: false });

      // Title
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#e2e8f0')
        .text('Security Notice', noticeBoxX + 50, noticeBoxY + 16, { lineBreak: false });

      // Points
      let ptY = noticeBoxY + 42;
      doc.fontSize(9.5).font('Helvetica').fillColor('#a0aec0');
      noticePoints.forEach((pt) => {
        doc.text(`• ${pt}`, noticeBoxX + 24, ptY, { width: noticeBoxW - 36, lineBreak: false });
        ptY += 18;
      });

      doc.y = noticeBoxY + noticeBoxH + 28;

      // ── HR divider ─────────────────────────────────────────────
      ensureSpace(70);
      doc.save();
      const hrGrad = doc.linearGradient(margin, doc.y, margin + contentW, doc.y);
      hrGrad.stop(0, '#00000000').stop(0.5, colors.border).stop(1, '#00000000');
      doc.rect(margin, doc.y, contentW, 1).fill(hrGrad);
      doc.restore();
      doc.y += 22;

      // ── Footer note ────────────────────────────────────────────
      doc.fontSize(9).font('Helvetica').fillColor('#4a5568')
        .text(
          'If you did not request a transaction code, please contact our support team immediately.',
          margin + 10, doc.y, { width: contentW - 20, align: 'center' }
        );
      doc.y += 14;
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#4a5568')
        .text('Do not reply to this email.', margin + 10, doc.y, { width: contentW - 20, align: 'center' });
      doc.y += 28;

      // ── Bottom gold gradient line ──────────────────────────────
      ensureSpace(50);
      doc.save();
      const botGold = doc.linearGradient(cardX, doc.y, cardX + cardW, doc.y);
      botGold.stop(0, colors.goldDarker).stop(0.25, colors.goldDark).stop(0.5, colors.gold).stop(0.75, colors.goldDark).stop(1, colors.goldDarker);
      doc.rect(cardX, doc.y, cardW, 3).fill(botGold);
      doc.restore();
      doc.y += 3;

      // ── Footer strip ───────────────────────────────────────────
      const footerStripY = doc.y;
      doc.save();
      doc.rect(cardX, footerStripY, cardW, 52).fill(colors.darkBg);
      doc.restore();

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#4a5568')
        .text('© 2026 TIMO FX', cardX, footerStripY + 14, { width: cardW / 2 - 10, align: 'right', lineBreak: false });
      doc.fontSize(9).font('Helvetica').fillColor('#4a5568')
        .text(' · All rights reserved', cardX + cardW / 2 - 10, footerStripY + 14, { lineBreak: false });
      doc.fontSize(7.5).font('Helvetica').fillColor('#2a3050')
        .text('This is a secure automated message from TIMO FX Security Service',
          cardX, footerStripY + 30, { width: cardW, align: 'center' });

      // ── Below card footer ──────────────────────────────────────
      doc.fontSize(8).font('Helvetica').fillColor(colors.dimText)
        .text('This is an automated message. Please do not reply to this email.',
          margin, footerStripY + 68, { width: contentW, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export { generateTransactionCodePDF };