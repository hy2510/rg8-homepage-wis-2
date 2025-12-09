'use client'

import { FooterMenuStyle } from '@/8th/shared/styled/SharedStyled'

/**
 *
 */
export default function FooterMenu() {
  return (
    <FooterMenuStyle>
      <div className="menu-item">홈페이지</div>
      <div className="menu-item">RG 소식</div>
      <div className="menu-item">도움말</div>
      <div className="menu-item">고객센터</div>
    </FooterMenuStyle>
  )
}
